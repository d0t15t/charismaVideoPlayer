/**
 * Bounce in place
 */
// $.fn.bIp = function(dist) {
//   var $e = this;
//   $e.velocity({
//     translateY: dist
//   }, 800, {
//     // delay: 500
//   }, "easeOutQuad");

//   $e.velocity({
//     translateY: dist * -1
//   }, {
//     duration: 100,
//     complete: function() {
//        $e.bIp(dist);
//     }
//   }, "easeInSine");

//   return this;
// };


/**
 *
 */
function numberBetween(a, b) {
  return Math.floor(Math.random() * b) + a;
}