$(function () {
	var availableTags = [
      "Home",
      "Events",
      "Schedule",
      "Announcements",
      "Prizes",
      "Resources",
      "HackRPI XI",
      "Sponsors",
      "Winners",
      "Join Us",
      "Help",
      "Volunteer",
      "MLH",
      "Leaderboard",
      "Code of Conduct",
   ];

	$("#tags").autocomplete({
		source: availableTags,
		select: function (event, ui) {
			// Redirect the user based on the selected item
			var selectedItem = ui.item.value;
			redirectUser(selectedItem);
		},
	});

   // Add Enter key functionality
   $("#tags").on("keydown", function (event) {
      if (event.key === "Enter") {
         var inputText = $(this).val().trim(); // Get the entered text
         redirectUser(inputText); // Directly call redirectUser
      }
   });

   function redirectUser(selectedItem) {
      // Normalize the input to lowercase
      selectedItem = selectedItem.trim().toLowerCase();
      // Define the URLs or actions based on the selected item
      var redirectUrls = {
         "Home": "http://example/orange.html",
      "Events": "http://example/orange.html",
      "Schedule": "http://example/orange.html",
      "Announcements": "http://example/orange.html",
      "Prizes": "http://example/orange.html",
      "Resources": "http://example/orange.html",
      "HackRPI XI": "http://example/orange.html",
      "Sponsors": "http://example/orange.html",
      "Winners": "http://example/orange.html",
      "Join Us": "http://example/orange.html",
      "Help": "http://example/orange.html",
      "Volunteer": "http://example/orange.html",
      "MLH": "http://example/orange.html",
      "Leaderboard": "http://example/orange.html",
      "Code of Conduct": "http://example/orange.html",
      };

      // Get the URL for the selected item
      var url = redirectUrls[selectedItem];

      // Redirect the user if the URL exists
      if (url) {
         window.location.href = url;
      } else {
         alert("No redirect URL found for '" + selectedItem + "'");
      }
   }
});
