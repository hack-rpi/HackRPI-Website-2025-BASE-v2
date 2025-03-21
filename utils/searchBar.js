$(function () {
	var availableTags = ["apple", "banana", "grape", "orange"];

	$("#tags").autocomplete({
		source: availableTags,
		select: function (event, ui) {
			// Redirect the user based on the selected item
			var selectedItem = ui.item.value;
			redirectUser(selectedItem);
		},
	});

	function redirectUser(selectedItem) {
		// Normalize the input to lowercase
		selectedItem = selectedItem.trim().toLowerCase();
		// Define the URLs or actions based on the selected item
		var redirectUrls = {
			apple: "http://example/apple.html",
			banana: "http://example/banana.html",
			grape: "http://example/grape.html",
			orange: "http://example/orange.html",
		};

		// Get the URL for the selected item
		var url = redirectUrls[selectedItem];
	}
});
