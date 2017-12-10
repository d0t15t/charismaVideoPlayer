+++
date = "2017-12-06T21:48:51-07:00"
title = "Miscommunication"
name = "episode-1-miscommunication"
[menu.main]
  identifier = "episode-1"
+++

<script type="text/javascript">
  var d = {
    'id' : 'scene-elements',
    'e' : {}, // Episode scene elements
    'n' : {}, // Name elements
  };
</script>
<script src="/data/names_data.js"></script>
<script src="/data/episode_1_data.js"></script>
<script type="text/javascript">

  // Sort by target zone
  var targetZones = [];
  var temp = 0;
  for (i = 0; i < d.e - 1; i++) {
    for (j = i + 1; j < d.e.length; j++) {
      if (d.e[i].targetZone > sd.eE[j].targetZone) {
        temp = d.e[j];
        d.e[j] = d.e[i];
        d.e[i] = temp;
      }
    }
  }

</script>

