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

// 09.03.20
/*
     function PlayerjsAsync() {
        myPlayer = new Playerjs({
          id: "player",
          // file: [{"title": "Серия1", "file": "https://plrjs.com/sample.mp4"}, {"title": "Серия2", "file": "https://plrjs.com/sample.mp4"}],
          file: [
                        {"title": "1) 1.1. AE Basics | 00:31:36", "file": "https://vss4.coursehunter.net/s/8f498c0014097080fc094514a0045454/mds-uianess/lesson1.mp4", "subtitle": "", "id": "c3315l1"},
                        {"title": "2) 1.2. Render Tips | 00:09:40", "file": "https://vss4.coursehunter.net/s/8f8ca045de49fc1409140470800900de/mds-uianess/lesson2.mp4", "subtitle": "", "id": "c3315l2"},
                        {"title": "3) 2. Import and Export of Illustrations | 00:17:12", "file": "https://vss4.coursehunter.net/s/8f1470808c09a0140945fc4930000430/mds-uianess/lesson3.mp4", "subtitle": "", "id": "c3315l3"},
                        {"title": "4) 3.1. Masks | 00:15:34", "file": "https://vss4.coursehunter.net/s/8fe909147004148cfc4580094900a0e9/mds-uianess/lesson4.mp4", "subtitle": "", "id": "c3315l4"},
                        {"title": "5) 3.2. Text Animation | 00:17:47", "file": "https://vss4.coursehunter.net/s/8f098000fc147009a004144945b98cb9/mds-uianess/lesson5.mp4", "subtitle": "", "id": "c3315l5"},
                        {"title": "6) 3.3. Path Animation | 00:24:42", "file": "https://vss4.coursehunter.net/s/8f7045a014048cfc0380490909140003/mds-uianess/lesson6.mp4", "subtitle": "", "id": "c3315l6"},
                        {"title": "7) 3.4. Keyframes | 00:28:09", "file": "https://vss4.coursehunter.net/s/8f6ba070004980148cfc45091404096b/mds-uianess/lesson7.mp4", "subtitle": "", "id": "c3315l7"},
                        {"title": "8) 4.1. Prototyping in Principle | 00:27:42", "file": "https://vss4.coursehunter.net/s/8f7045a014048cfc0680490909140006/mds-uianess/lesson8.mp4", "subtitle": "", "id": "c3315l8"},
                        {"title": "9) 4.2. Prototyping in After Effects | 00:23:24", "file": "https://vss4.coursehunter.net/s/8f09004570048c14a0fc098049147d7d/mds-uianess/lesson9.mp4", "subtitle": "", "id": "c3315l9"},
                        {"title": "10) 5. Motion Tools &amp; Swiss Knife | 00:29:52", "file": "https://vss4.coursehunter.net/s/8ffc04009f0914457009498014a08c9f/mds-uianess/lesson10.mp4", "subtitle": "", "id": "c3315l10"},
                        {"title": "11) 6. Preloaders | 00:35:54", "file": "https://vss4.coursehunter.net/s/8feb09147004148cfc4580094900a0eb/mds-uianess/lesson11.mp4", "subtitle": "", "id": "c3315l11"},
                        {"title": "12) 7. Morphing | 00:35:52", "file": "https://vss4.coursehunter.net/s/8f8ca045db49fc1409140470800900db/mds-uianess/lesson12.mp4", "subtitle": "", "id": "c3315l12"},
                        {"title": "13) 8. Export to Code | 00:48:16", "file": "https://vss4.coursehunter.net/s/8f7045a014048cfc0880490909140008/mds-uianess/lesson13.mp4", "subtitle": "", "id": "c3315l13"},
                        {"title": "14) 9. Visual Languages | 00:57:38", "file": "https://vss4.coursehunter.net/s/8f1470808c09a0140945fc492e00042e/mds-uianess/lesson14.mp4", "subtitle": "", "id": "c3315l14"},
                        {"title": "15) 10. Graph Rig | 00:40:35", "file": "https://vss4.coursehunter.net/s/8f8ca045d849fc1409140470800900d8/mds-uianess/lesson15.mp4", "subtitle": "", "id": "c3315l15"},
                        {"title": "16) 11. Footage Integration, Augmented Reality and 3D | 00:31:54", "file": "https://vss4.coursehunter.net/s/8fed09147004148cfc4580094900a0ed/mds-uianess/lesson16.mp4", "subtitle": "", "id": "c3315l16"},
                        {"title": "17) 12.1 Animations for Showreel | 00:23:10", "file": "https://vss4.coursehunter.net/s/8f044500490913a08c09807014fc1413/mds-uianess/lesson17.mp4", "subtitle": "", "id": "c3315l17"},
                        {"title": "18) 12.2 Make your Showreel | 00:00:36", "file": "https://vss4.coursehunter.net/s/8ffc04009f0914457009498014a08c9f/mds-uianess/lesson18.mp4", "subtitle": "", "id": "c3315l18"},
                      ],
          //           vast: 0,
          //           poster: " /uploads/course_posters_/osnovy-animacii-interfeysov.jpg "
        });
      }
*/

export const reFileItem = /{"title"[ :]+"([\s\S]*?)"\s*,\s*"file"[ :]+"([^"]*?)"[^}]*},{0,1}/g;

// 02.19.21: axios.get('/course/3787/lessons') -> //course/(\d{3,10}?)/lessons'/g -> /axios\.get\('\/course\/3787\/lessons'\)/g -> /\/course\/\d{3,10}?\/lessons/g
// It cannot be global (or reset lastIndex):
//export const reAxiosItemsQuery = /\/course\/\d{3,10}?\/lessons/g;

// Lesson items for player 03.26.21
/*
[
  {
    "title": "1 О данном видео курсе | 00:09:28",        // In reply it is: "title": "1 \u041e \u0434\u0430\u043d\u043d\u043e\u043c \u0432\u0438\u0434\u0435\u043e \u043a\u0443\u0440\u0441\u0435 | 00:09:28",
    "file": "https://vss3.coursehunter.net/s/8f911b8f9fc0036506c18081141576c1/wfms-nodecc26/lesson1.mp4",
    "subtitle": "[English]",
    "id": "c18781"
  },
  {
    "title": "2 Что такое Node.js | 00:06:05",
    "file": "https://vss3.coursehunter.net/s/8f819f038fc09180761b3e066514153e/wfms-nodecc26/lesson2.mp4",
    "subtitle": "[English]",
    "id": "c18782"
  },
  {
    "title": "3 Как установить Node.js | 00:04:50",
    "file": "https://vss3.coursehunter.net/s/8f817665e0c0911403151b9f06808fe0/wfms-nodecc26/lesson3.mp4",
    "subtitle": "[English]",
    "id": "c18783"
  },
  ...
  {
    "title": "101 Удаление задачи | 00:04:43",
    "file": "https://vss3.coursehunter.net/s/8fc0651b819103768f9f061484158084/wfms-nodecc26/lesson101.mp4",
    "subtitle": "[English]",
    "id": "c1878101"
  }
]
*/

// 03.27.21 Description script
/*
[
    {
        "name": "Vue 3, Nuxt.js and Laravel: A Practical Guide",
        "alternateName": "Vue 3, Nuxt.js и Laravel: Практическое Руководство",
        "about": {
            "name": "Frontend"
        },
        "creator": [
            {
                "@type": "Person",
                "name": "udemy"
            }
        ],
        "@type": "Course",
        "aggregateRating": {
            "@type": "AggregateRating",
            "bestRating": 5,
            "ratingValue": "3.3",
            "reviewCount": 3,
            "worstRating": 0
        },
        "@id": "https://coursehunter.net/course/vue-3-nuxt-js-i-laravel-prakticheskoe-rukovodstvo",
        "inLanguage": "en",
        "image": "https://coursehunter.net/https://cdn.coursehunter.net/course/vue-3-nuxt-js-i-laravel-prakticheskoe-rukovodstvo.jpg",
        "description": "Узнайте, как создать 3 разных приложения с Vue 3, Nuxt.js и Laravel. Первое приложение будет приложением админ панели, использующим Vue 3 Composition API. Второе будет приложением Инфлюенсер, использующим Vue 3 Options API. Третьим приложением будет Checkout с использованием Nuxt.js.",
        "@context": "https://schema.org",
        "datePublished": "2021-03-26",
        "dateModified": "2021-03-27",
        "provider": [
            {
                "@type": "Organization",
                "name": "udemy",
                "sameAs": "https://coursehunter.net/source/udemy"
            }
        ],
        "isAccessibleForFree": false,
        "publisher": {
            "@type": "Organization",
            "name": "CourseHunter",
            "sameAs": "https://coursehunter.net"
        }
    }
]
*/
export namespace CourseInfo {
    
    export interface Description {
        name: string;
        alternateName: string;
        datePublished: string;
        dateModified: string;
        creator: Creator[];
        inLanguage: string;
        image: string;
        description: string;
        provider: Provider[];
        isAccessibleForFree: boolean;
        '@id': string;
        about: About;

        aggregateRating: Rating;
        publisher: Provider;
        '@context': string;
        '@type': string;
    }

    export interface Creator {
        '@type': string;
        name: string;
    }

    export interface Provider {
        '@type': string;
        name: string;
        sameAs: string;
    }

    export interface About {
        name: string;
    }

    export interface Rating {
        '@type': string;
        bestRating: number;
        ratingValue: string;
        reviewCount: number;
        worstRating: number;
    }

} //namespace CourseInfo
