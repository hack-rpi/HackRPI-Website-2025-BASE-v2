import React from 'react';
import { render, screen } from '@testing-library/react';
import AboutUs from '@/components/about-us';

// Mock the RegistrationLink component
jest.mock('@/components/themed-components/registration-link', () => {
  return function MockRegistrationLink({ className }: { className?: string }) {
    return <div data-testid="registration-link" className={className}>Registration Link</div>;
  };
});

describe('AboutUs Component', () => {
  beforeEach(() => {
    // Reset the mocks before each test
    jest.clearAllMocks();
  });

  it('renders the component with correct headings', () => {
    render(<AboutUs />);
    
    // Check if the main heading is rendered
    const mainHeading = screen.getByText('About HackRPI');
    expect(mainHeading).toBeInTheDocument();
    
    // Check if the "When & Where" heading is rendered
    const whenWhereHeading = screen.getByText(/When & Where/i);
    expect(whenWhereHeading).toBeInTheDocument();
  });

  it('renders the theme information correctly', () => {
    render(<AboutUs />);
    
    // Check if the theme text is rendered
    // We use getAllByText because the theme appears multiple times
    const themeElements = screen.getAllByText('Urban Upgrades');
    expect(themeElements.length).toBeGreaterThan(0);
    
    // Check that the theme has the correct styling
    const firstThemeElement = themeElements[0];
    expect(firstThemeElement).toHaveClass('text-hackrpi-orange');
    expect(firstThemeElement).toHaveClass('font-bold');
  });

  it('renders the date and location information', () => {
    render(<AboutUs />);
    
    // Check if the date is rendered
    const dateElement = screen.getByText('November 15-16, 2025');
    expect(dateElement).toBeInTheDocument();
    
    // Check if the location details are rendered
    const institutionElement = screen.getByText('Rensselaer Polytechnic Institute');
    expect(institutionElement).toBeInTheDocument();
    
    const buildingElement = screen.getByText('Darrin Communications Center');
    expect(buildingElement).toBeInTheDocument();
  });

  it('renders the registration link component', () => {
    render(<AboutUs />);
    
    // Check if the registration link is rendered
    const registrationLink = screen.getByTestId('registration-link');
    expect(registrationLink).toBeInTheDocument();
    expect(registrationLink).toHaveClass('text-xl');
  });

  it('renders the scrolling "REGISTER NOW!" text', () => {
    const { container } = render(<AboutUs />);
    
    // Check if the scrolling register text is rendered
    const registerText = screen.getByText(/REGISTER NOW!/i);
    expect(registerText).toBeInTheDocument();
    
    // Find the dark purple div in the document directly
    // Based on the component structure it's the first div with this class
    const darkPurpleDiv = container.querySelector('.bg-hackrpi-dark-purple');
    expect(darkPurpleDiv).toBeInTheDocument();
    expect(darkPurpleDiv).toHaveClass('text-black');
    expect(darkPurpleDiv?.textContent).toContain('REGISTER NOW!');
  });

  it('renders the about description text', () => {
    render(<AboutUs />);
    
    // Check if the description paragraphs are rendered
    const introText = screen.getByText(/HackRPI 2024 is Rensselaer Polytechnic Institute/i);
    expect(introText).toBeInTheDocument();
    
    const goalText = screen.getByText(/Our goal is to inspire and challenge innovators/i);
    expect(goalText).toBeInTheDocument();
  });
}); 