/**
 * Centralized Mock Registry for HackRPI Website Testing
 * Created to improve test maintainability and reduce redundancies
 *
 * This file contains reusable mock implementations for common components
 * and browser APIs used throughout the test suite.
 */

import React from "react";
import "@testing-library/jest-dom";

/**
 * Mock for the RegistrationLink component
 * Used in both about-us.test.tsx and faq.test.tsx
 */
export const MockRegistrationLink = ({ className }: { className?: string }) => {
	return (
		<div data-testid="registration-link" className={className} role="link" aria-label="Registration Link">
			Registration Link
		</div>
	);
};

/**
 * Enhanced IntersectionObserver mock with full simulation capabilities
 * Combines the best aspects of both implementations from jest.setup.js and navigation.test.tsx
 */
export class MockIntersectionObserver implements IntersectionObserver {
	readonly root: Element | Document | null = null;
	readonly rootMargin: string = "";
	readonly thresholds: ReadonlyArray<number> = [0];

	private callback: IntersectionObserverCallback;
	private elements = new Map<Element, boolean>();

	constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
		this.callback = callback;
		if (options) {
			this.root = options.root || null;
			this.rootMargin = options.rootMargin || "0px";
			this.thresholds = Array.isArray(options.threshold) ? options.threshold : [options.threshold || 0];
		}
	}

	observe(element: Element): void {
		this.elements.set(element, false);

		// Schedule a call to simulate intersection after a short delay
		setTimeout(() => {
			this.simulateIntersection(element, true);
		}, 50);
	}

	unobserve(element: Element): void {
		this.elements.delete(element);
	}

	disconnect(): void {
		this.elements.clear();
	}

	// Helper for tests to simulate intersection events
	simulateIntersection(element: Element, isIntersecting: boolean): void {
		if (this.elements.has(element)) {
			this.elements.set(element, isIntersecting);

			const entry = {
				isIntersecting,
				target: element,
				intersectionRatio: isIntersecting ? 1 : 0,
				boundingClientRect: element.getBoundingClientRect(),
				intersectionRect: isIntersecting ? element.getBoundingClientRect() : new DOMRect(),
				rootBounds: null,
				time: Date.now(),
			} as IntersectionObserverEntry;

			this.callback([entry], this as IntersectionObserver);
		}
	}

	// Simulate all observed elements intersecting or not
	simulateAllIntersections(isIntersecting: boolean): void {
		const entries: IntersectionObserverEntry[] = [];

		this.elements.forEach((_, element) => {
			this.elements.set(element, isIntersecting);

			entries.push({
				isIntersecting,
				target: element,
				intersectionRatio: isIntersecting ? 1 : 0,
				boundingClientRect: element.getBoundingClientRect(),
				intersectionRect: isIntersecting ? element.getBoundingClientRect() : new DOMRect(),
				rootBounds: null,
				time: Date.now(),
			} as IntersectionObserverEntry);
		});

		if (entries.length > 0) {
			this.callback(entries, this as IntersectionObserver);
		}
	}

	takeRecords(): IntersectionObserverEntry[] {
		const entries: IntersectionObserverEntry[] = [];

		this.elements.forEach((isIntersecting, element) => {
			entries.push({
				isIntersecting,
				target: element,
				intersectionRatio: isIntersecting ? 1 : 0,
				boundingClientRect: element.getBoundingClientRect(),
				intersectionRect: isIntersecting ? element.getBoundingClientRect() : new DOMRect(),
				rootBounds: null,
				time: Date.now(),
			} as IntersectionObserverEntry);
		});

		return entries;
	}
}

/**
 * Common accessibility checks that can be reused across component tests
 * This reduces duplication in individual test files
 */
export function commonAccessibilityChecks(element: HTMLElement) {
	// Check that all buttons have accessible names
	const buttons = element.querySelectorAll("button");
	buttons.forEach((button) => {
		expect(button).toHaveAccessibleName();
	});

	// Check that all links have accessible names
	const links = element.querySelectorAll("a");
	links.forEach((link) => {
		expect(link).toHaveAccessibleName();
	});

	// Check that all images have alt text
	const images = element.querySelectorAll("img");
	images.forEach((image) => {
		expect(image).toHaveAttribute("alt");
	});

	// Check that all form controls have labels
	const formControls = element.querySelectorAll("input, select, textarea");
	formControls.forEach((control) => {
		expect(control).toHaveAccessibleName();
	});
}

/**
 * Mock form submission event with full typing support
 */
export function createMockFormEvent(formData: Record<string, any> = {}) {
	return {
		preventDefault: jest.fn(),
		stopPropagation: jest.fn(),
		target: {
			checkValidity: jest.fn().mockReturnValue(true),
			reportValidity: jest.fn(),
			reset: jest.fn(),
			elements: Object.fromEntries(
				Object.entries(formData).map(([key, value]) => [key, { value, name: key, id: key }]),
			),
		},
		currentTarget: {
			checkValidity: jest.fn().mockReturnValue(true),
			reportValidity: jest.fn(),
			reset: jest.fn(),
			elements: Object.fromEntries(
				Object.entries(formData).map(([key, value]) => [key, { value, name: key, id: key }]),
			),
		},
	};
}

export default {
	MockRegistrationLink,
	MockIntersectionObserver,
	commonAccessibilityChecks,
	createMockFormEvent,
};
