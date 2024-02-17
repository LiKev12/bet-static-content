const MOCK_MY_USER_ID = '985a92b3-c0f3-486a-8d95-1c2b020ca80d'; // chenpachi         (pwd: chenpachipwd)
// const MOCK_MY_USER_ID = 'ef613db3-d5be-4f1c-9a7c-d6c27edfbe45'; // songdj            (pwd: songdjpwd)
// const MOCK_MY_USER_ID = 'd79adbfb-dc53-461f-8e41-5c16e0e64103'; // mittens (amit)    (pwd: mittenspwd)
// const MOCK_MY_USER_ID = '22857ceb-39a0-4569-836f-29dba98c75bc'; // megan_li          (pwd: megan_lipwd)
// const MOCK_MY_USER_ID = 'f4e7c3eb-73b7-409b-b553-602a41db3f26'; // bobby             (pwd: bobbypwd)
// const MOCK_MY_USER_ID = '7b4bc526-1d01-4b66-b692-a80ccc04dc72'; // jackjack             (pwd: jackjackpwd)
// const MOCK_MY_USER_ID = '1842375f-b859-4f4d-8382-3492f85475b1'; // jillcats          (pwd: jillcatspwd)

const MOCK_PODS: any = [
    {
        id: 'def1b03d-e6d1-43dc-85a5-b16d6997d6d8',
        name: 'Pod - Hiking PNW',
        description: 'join to log and share your favorite hikes in the great PNW!',
        is_public: true,
    },
    {
        id: 'f0a30b67-efb1-451f-b795-c7dc29f9fc79',
        name: 'Pod - Tennis Seattle',
        description: 'for local yellow fuzzy ball enthusiasts',
        is_public: true,
    },
    {
        id: '7f53c6f3-1fa4-4201-8a3e-d3fe52cde248',
        name: 'Pod - PokemonGo Seattle',
        description: 'for anyone looking to do raids or community days together',
        is_public: true,
    },
    {
        id: '29039ac6-dd96-40a9-bf82-ce0084845edf',
        name: 'Pod - Chess Seattle',
        description: 'for those interested in online and in-person tournaments, we are back and active after Covid!',
        is_public: true,
    },
    {
        id: '4060af93-8756-4442-adf6-4262f7dda377',
        name: 'Pod - Visit 50 US states',
        description: "Collect your state visits here, and earn a stamp once you've collected all 50!",
        is_public: true,
    },
    {
        id: 'f92c6d37-fd72-47b1-84df-a399749c9a60',
        name: 'Pod - Collect quarters from 50 US states',
        description: "Track your quarter collection here, and earn a stamp once you've collected all 50!",
        is_public: true,
    },
    {
        id: '79bf8d60-223f-4813-a15b-82726421758b',
        name: 'Pod - National parks collection',
        description: "National park enthusiast? You've come to the right place. Record your national park visits here!",
        is_public: true,
    },
    {
        id: '8a4ae019-f46b-41c8-bb14-5a230f5cd935',
        name: 'Pod - PokemonGo Kanto',
        description: 'PokemonGo Kanto collection',
        is_public: true,
    },
    {
        id: '0612ca0f-324a-4108-8d09-efa5159b1584',
        name: 'Pod - PokemonGo Johto',
        description: 'PokemonGo Johto collection',
        is_public: true,
    },
    {
        id: '894d33d1-8171-4967-8b8b-b4720ba54ee1',
        name: 'Pod - PokemonGo Hoenn',
        description: 'PokemonGo Hoenn collection',
        is_public: true,
    },
    {
        id: '51dadce7-ed41-42e9-bd64-023c84c6c13d',
        name: 'mhs class 2015 - Science Olympiad',
        description: 'nationals here we comeeee',
        is_public: false,
    },
    {
        id: '43f2693f-e56f-4bd0-84e6-57d5fdeb3dff',
        name: 'mhs class 2015 - Academic team',
        description: "What's the capital of Alaska?",
        is_public: false,
    },
    {
        id: '3662d552-24f6-42e5-80e8-c3e6c52cdc39',
        name: 'jack and jill family pod',
        description: 'for da fam',
        is_public: false,
    },
    {
        id: '41de4032-68e9-409f-b9e4-f79deeb4e0a9',
        name: 'universe of bots',
        description: 'hello world everyone',
        is_public: true,
    },
];

const MOCK_STAMPS: any = [
    {
        id: 'c5fa4011-3d44-45bd-9dd4-40a07710c2b8',
        name: 'visit all 50 states',
        description: 'definition of visit can vary - up to you to decide!',
    },
    {
        id: 'e98aa83d-35b8-44d1-a039-ab5dc7478617',
        name: 'Collect quarters from all 50 states',
        description: 'share your collection with others!',
    },
    {
        id: '1cd70d99-c6ce-4cbb-bda4-264d874ef8d6',
        name: 'PokemonGo legendary collector - completed legendary pokedex in Kanto, Johto, and Hoenn region',
        description:
            '18 in total: 1. Articuno (Kanto #144), 2. Zapdos (Kanto #145), 3. Moltres (Kanto #146), 4. Mewtwo (Kanto #150), 5. Mew (Kanto #151), 6. Entei (Johto #244), 7. Ho-Oh (Johto #250), 8. Lugia (Johto #249), 9. Raikou (Johto #243), 10. Suicune (Johto #245), 11. Regirock (Hoenn #377), 12. Regice (Hoenn #378), 13. Registeel (Hoenn #379), 14. Latios (Hoenn #381), 15. Latias (Hoenn #380), 16. Kyogre (Hoenn #382), 17. Groudon (Hoenn #383), 18. Rayquaza (Hoenn #384)',
    },
    {
        id: 'a2dc9c21-bddc-4f5f-bb57-d74158245e23',
        name: 'completion challenge - Washington State National Parks',
        description:
            "Give yourself a pat on the back if you've been to all 3! Olympic National Park, Mount Rainier National Park, North Cascades",
    },
    {
        id: '63399bf6-d617-484b-b8f2-abc7122fdf29',
        name: 'completion challenge - California State National Parks',
        description:
            "Give yourself a pat on the back if you've been to all 8! Channel Islands, Death Valley, Joshua Tree, Kings Canyon, Lassen Volcanic, Redwood, Sequoia, Yosemite",
    },
    {
        id: 'b95f4cb7-d6d8-4e7a-ba99-f065fcd1b175',
        name: 'academic team big brain',
        description: 'only for the biggest brains',
    },
    {
        id: '0c02eb9a-5448-4404-89b0-0039c52f94dd',
        name: 'scioly protein folding champs',
        description: 'only for the best (human) protein folders',
    },
    {
        id: 'f615a7c2-1678-4e45-8092-9756ccf65623',
        name: 'scioly experimental design pros',
        description: 'we celebrate successful experiments here',
    },
];

const MOCK_USERS: any = [
    {
        id: '985a92b3-c0f3-486a-8d95-1c2b020ca80d',
        name: 'Michael Chen',
        username: '@chenpachi',
        bio: "Hi! I'm new to this platform, but I enjoy baking, cooking, lifting. Follow me on insta at @chenpachi.",
        image_path: 'https://www.signivis.com/img/custom/avatars/member-avatar-01.png',
    },
    {
        id: 'ef613db3-d5be-4f1c-9a7c-d6c27edfbe45',
        name: 'Daniel Song',
        username: '@songdj',
        bio: 'Interested in PokemonGo, chess, and tennis',
        image_path: 'https://www.signivis.com/img/custom/avatars/member-avatar-03.png',
    },
    {
        id: 'd79adbfb-dc53-461f-8e41-5c16e0e64103',
        name: 'Amit Sathe',
        username: '@mittens',
        bio: 'big fan of national parks and hiking',
        image_path: 'https://www.signivis.com/img/custom/avatars/member-avatar-05.png',
    },
    {
        id: '22857ceb-39a0-4569-836f-29dba98c75bc',
        name: 'Megan Li',
        username: '@megan_li',
        bio: 'running 🏃, cooking, lifting - training for my first marathon this fall!',
        image_path: 'https://www.signivis.com/img/custom/avatars/member-avatar-02.png',
    },
    {
        id: 'f4e7c3eb-73b7-409b-b553-602a41db3f26',
        name: 'Bob',
        username: '@bobby',
        bio: 'new to this - follow me!',
        image_path: 'https://fastly.picsum.photos/id/249/200/200.jpg?hmac=75zqoHvrxGGVnJnS8h0gUzZ3zniIk6PggG38GjmyOto',
    },
    {
        id: '7b4bc526-1d01-4b66-b692-a80ccc04dc72',
        name: 'Jack',
        username: '@jackjack',
        bio: 'new to this - follow me and @jillcats',
        image_path: 'https://fastly.picsum.photos/id/404/200/200.jpg?hmac=7TesL9jR4uM2T_rW-vLbBjqvfeR37MJKTYA4TV-giwo',
    },
    {
        id: '1842375f-b859-4f4d-8382-3492f85475b1',
        name: 'Jill',
        username: '@jillcats',
        bio: 'new to this - follow me and @jackjack',
        image_path: 'https://fastly.picsum.photos/id/201/200/200.jpg?hmac=bDRwJ_w2on8pQ9tbqlqMghsddYlj20LS9E3l3NswK7Q',
    },
];

export { MOCK_MY_USER_ID, MOCK_PODS, MOCK_STAMPS, MOCK_USERS };
