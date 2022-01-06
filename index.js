///Button
/*jshint esversion: 6 */
/*jshint strict:false */


function nextAnimation() {

    // Animation of the robot
    const states = ['Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing'];
    const emotes = ['Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp'];

    const model = document.getElementById('ar_object');

     model.setAttribute('animation-mixer', {
        clip:states[2],
        loop: 'repeat',
        crossFadeDuration: 0.4,
      });

}