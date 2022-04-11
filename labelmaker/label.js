$(function(){

  $(`.color`).spectrum({
    color: '#000000',
    preferredFormat: "hex3",
    move: function (color) {
      cssChange(`#${byId + byCheck}`, 'color', color);
    }
  });
  $(`.color-bg`).spectrum({
    color: '#000000',
    showAlpha: true,
    preferredFormat: "hex3",
    move: function (color) {
      cssChange("#" + byId, 'background-color', color);
    }
  });

})