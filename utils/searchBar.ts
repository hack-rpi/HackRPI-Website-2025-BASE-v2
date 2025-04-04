import $ from 'jquery';
import 'jquery-ui/ui/widgets/autocomplete';

export const initializeSearch = () => {
  const availableTags = [
    "Home", "Events", "Schedule", "Announcements", "Prizes", "Resources",
    "HackRPI XI", "Sponsors", "Winners", "Join Us", "Help", "Volunteer",
    "MLH", "Leaderboard", "Code of Conduct", "Homepage", "Board", "Join",
    "Help Us", "Main", "Mainpage", "Codes", "Plan", "Participatns", "Awards",
  ];

  $("#tags").autocomplete({
    source: availableTags,
    select: function (event: any, ui: any) {
      const selectedItem = ui.item.value;
      redirectUser (selectedItem);
    },
  });

  $("#tags").on("keydown", function (event) {
    if (event.key === "Enter") {
      const inputText = ($(this).val() as string).trim();
      redirectUser (inputText);
    }
  });

  function redirectUser (selectedItem: string) {
    selectedItem = selectedItem.trim().toLowerCase();
    const redirectUrls: { [key: string]: string } = {
      "home": "http://example/orange.html",
      "events": "http://example/orange.html",
      "schedule": "http://example/orange.html",
      "announcements": "http://example/orange.html",
      "prizes": "http://example/orange.html",
      "resources": "http://example/orange.html",
      "hackrpi xi": "http://example/orange.html",
      "sponsors": "http://example/orange.html",
      "winners": "http://example/orange.html",
      "join us": "http://example/orange.html",
      "help": "http://example/orange.html",
      "volunteer": "http://example/orange.html",
      "mlh": "http://example/orange.html",
      "leaderboard": "http://example/orange.html",
      "code of conduct": "http://example/orange.html",
      "homepage": "http://example/orange.html",
      "board": "http://example/orange.html",
      "join": "http://example/orange.html",
      "help us": "http://example/orange.html",
      "main": "http://example/orange.html",
      "mainpage": "http://example/orange.html",
      "codes": "http://example/orange.html",
      "plan": "http://example/orange.html",
      "participatns": "http://example/orange.html",
      "awards": "http://example/orange.html",
    };

    const url = redirectUrls[selectedItem];

    if (url) {
      window.location.href = url;
    } else {
      alert("No redirect URL found for '" + selectedItem + "'");
    }
  }
};