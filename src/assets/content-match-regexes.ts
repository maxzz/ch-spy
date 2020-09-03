// 09.01.20
/*
      var myPlayer;
            function onPlay(event) {
        if (event.type === "play") {
          var time = parseInt(myPlayer.api("time"));
          var currentTrack = parseInt(myPlayer.api("playlist_id").replace('x-', ''));
          saveTime("3451", "34422", currentTrack, time);
        }
      }

      document.getElementById("player").addEventListener("play", onPlay);

      function saveTime(courseId, userId, currentTrack, currentSeek) {
        if (typeof fetch === 'function') {
          fetch('/api/history', {
            method: 'post',
            body: JSON.stringify({
              course_id: courseId,
              user_id: userId,
              current_track: currentTrack,
              current_seek: currentSeek
            }),
            headers: new Headers({
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + Cookies.get("accessToken")
            }),
          })
            .then(function (response) {
              return response.json();
            })
            .then(function (data) {
              // console.log(data,'data');
            })
            .catch(function (error) {
              console.error(error);
            });
        }
      }
      
      function PlayerjsAsync() {
        myPlayer = new Playerjs({
          id: "player",
          // file: [{"title": "Серия1", "file": "https://plrjs.com/sample.mp4"}, {"title": "Серия2", "file": "https://plrjs.com/sample.mp4"}],
          file: [
                        {"title": "1) #0 What&#039;s New In Framer Motion 2 | 00:04:15", "file": "https://vss4.coursehunter.net/s/8f7045a014028cfc0880490909140008/lut-advframer/lesson1.mp4", "subtitle": "", "id": "c3451l1"},
                        {"title": "2) #1 Abstracting Animations | 00:10:29", "file": "https://vss4.coursehunter.net/s/8f09004570028c14a0fc098049147979/lut-advframer/lesson2.mp4", "subtitle": "", "id": "c3451l2"},
                        {"title": "3) #2 Enhanced Abstractions | 00:08:43", "file": "https://vss4.coursehunter.net/s/8ffc02007049094580c5098c1414a0c5/lut-advframer/lesson3.mp4", "subtitle": "", "id": "c3451l3"},
                        {"title": "4) #3 Animating Flexbox With Layout | 00:13:34", "file": "https://vss4.coursehunter.net/s/8f498c0014097080fc094514a0025555/lut-advframer/lesson4.mp4", "subtitle": "", "id": "c3451l4"},
                        {"title": "5) #4 Scale Correction | 00:06:52", "file": "https://vss4.coursehunter.net/s/8f1450a014fc098c7002494500098050/lut-advframer/lesson5.mp4", "subtitle": "", "id": "c3451l5"},
                        {"title": "6) #5 Loading Loop | 00:11:44", "file": "https://vss4.coursehunter.net/s/8f02450049091aa08c09807014fc141a/lut-advframer/lesson6.mp4", "subtitle": "", "id": "c3451l6"},
                        {"title": "7) #6 Loading Takeover Transition | 00:10:49", "file": "https://vss4.coursehunter.net/s/8f8ca045de49fc1409140270800900de/lut-advframer/lesson7.mp4", "subtitle": "", "id": "c3451l7"},
                        {"title": "8) #7 Draggable Drawer | 00:17:56", "file": "https://vss4.coursehunter.net/s/8f1470808c09a0140945fc4928000228/lut-advframer/lesson8.mp4", "subtitle": "", "id": "c3451l8"},
                        {"title": "9) #8 Enhanced Drawer | 00:10:33", "file": "https://vss4.coursehunter.net/s/8f02450049091fa08c09807014fc141f/lut-advframer/lesson9.mp4", "subtitle": "", "id": "c3451l9"},
                        {"title": "10) #9 Draggable List | 00:16:00", "file": "https://vss4.coursehunter.net/s/8f8ca045d649fc1409140270800900d6/lut-advframer/lesson10.mp4", "subtitle": "", "id": "c3451l10"},
                        {"title": "11) #10 Drag List with Handle | 00:07:58", "file": "https://vss4.coursehunter.net/s/8ffc02007049094580cc098c1414a0cc/lut-advframer/lesson11.mp4", "subtitle": "", "id": "c3451l11"},
                        {"title": "12) #11 Login Window | 00:14:53", "file": "https://vss4.coursehunter.net/s/8f144ca014fc098c700249450009804c/lut-advframer/lesson12.mp4", "subtitle": "", "id": "c3451l12"},
                        {"title": "13) #12 Reusable Animated Router | 00:10:41", "file": "https://vss4.coursehunter.net/s/8f498c0014097080fc094514a0025959/lut-advframer/lesson13.mp4", "subtitle": "", "id": "c3451l13"},
                        {"title": "14) #13 Repeat Options | 00:08:20", "file": "https://vss4.coursehunter.net/s/8f024500490912a08c09807014fc1412/lut-advframer/lesson14.mp4", "subtitle": "", "id": "c3451l14"},
                        {"title": "15) #14 Count Down | 00:10:17", "file": "https://vss4.coursehunter.net/s/8f4500a009147002148cfc098049abab/lut-advframer/lesson15.mp4", "subtitle": "", "id": "c3451l15"},
                        {"title": "16) #15 Two Way Drawer | 00:08:58", "file": "https://vss4.coursehunter.net/s/8f4500a009147002148cfc098049a1a1/lut-advframer/lesson16.mp4", "subtitle": "", "id": "c3451l16"},
                        {"title": "17) #16 Where To Go From Here | 00:05:28", "file": "https://vss4.coursehunter.net/s/8f09a0090000458014708c4902fc1400/lut-advframer/lesson17.mp4", "subtitle": "", "id": "c3451l17"},
                      ],
          poster: " /uploads/course_posters_/prodvinutaya-animaciya-react-s-framer-motion.jpg "
        });
      }
*/

export const reFileItem = /{"title"[ :]+"([\s\S]*?)"\s*,\s*"file"[ :]+"([^"]*?)"[^}]*},{0,1}/g;
