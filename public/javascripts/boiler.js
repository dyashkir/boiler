// Class to represent a row in the seat reservations grid
function SeatReservation(name, initialMeal) {
    var self = this;
    self.name = name;
    self.meal = ko.observable(initialMeal);
    
    self.formattedPrice = ko.computed( function() {
        var price = self.meal().price;
        return price ? "$" + price.toFixed(2) : "None";
    });
}

// Overall viewmodel for this screen, along with initial state
function ReservationsViewModel() {
  var self = this;

  // Non-editable catalog data - would come from the server
  self.availableMeals = ko.observableArray([]);

  // Editable data
  self.seats = ko.observableArray([]);

  self.addSeat = function() {
    self.seats.push(new SeatReservation("", self.availableMeals()[0]));
  };
  self.removeSeat = function(seat) {
    self.seats.remove(seat);
  };

  self.totalSurcharge = ko.computed( function() {
    var total = 0;
    self.seats().forEach( function(seat) {
      total += seat.meal().price;
    });
    return total;

  });

  self.save = function() {
    $.ajax("/reserve", {
      data: ko.toJSON({ reservations: self.seats }),
      type: "post", contentType: "application/json",
      success: function(result) { alert('saved'); }
    });
  };

  //load stuff on start
  $.getJSON("/ameals", function(allData) {
    allData.forEach(function(elem) {
      self.availableMeals.push(elem);
    });
  });

}

ko.applyBindings(new ReservationsViewModel());
