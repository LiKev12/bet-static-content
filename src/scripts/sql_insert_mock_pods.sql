INSERT INTO `pod` (
    id, 
    name, 
    description, 
    is_public, 
    is_require_moderator_approval_to_join, 
    timestamp_created, 
    id__user_created
) VALUES 
(
    UUID_TO_BIN('def1b03d-e6d1-43dc-85a5-b16d6997d6d8'),
    'Pod - Hiking PNW',
    'join to log and share your favorite hikes in the great PNW!',
    TRUE, 
    FALSE, 
    NOW(),
    UUID_TO_BIN('985a92b3-c0f3-486a-8d95-1c2b020ca80d')
),
(
    UUID_TO_BIN('f0a30b67-efb1-451f-b795-c7dc29f9fc79'),
    'Pod - Tennis Seattle',
    'for local yellow fuzzy ball enthusiasts',
    TRUE, 
    FALSE, 
    NOW(),
    UUID_TO_BIN('985a92b3-c0f3-486a-8d95-1c2b020ca80d')
),
(
    UUID_TO_BIN('7f53c6f3-1fa4-4201-8a3e-d3fe52cde248'),
    'Pod - PokemonGo Seattle',
    'for anyone looking to do raids or community days together',
    TRUE, 
    FALSE, 
    NOW(),
    UUID_TO_BIN('985a92b3-c0f3-486a-8d95-1c2b020ca80d')
),
(
    UUID_TO_BIN('29039ac6-dd96-40a9-bf82-ce0084845edf'),
    'Pod - Chess Seattle',
    'for those interested in online and in-person tournaments, we are back and active after Covid!',
    TRUE, 
    FALSE, 
    NOW(),
    UUID_TO_BIN('985a92b3-c0f3-486a-8d95-1c2b020ca80d')
),
(
    UUID_TO_BIN('4060af93-8756-4442-adf6-4262f7dda377'),
    'Pod - Visit 50 US stat',
    "Collect your state visits here, and earn a stamp once you've collected all 50!",
    TRUE, 
    FALSE, 
    NOW(),
    UUID_TO_BIN('985a92b3-c0f3-486a-8d95-1c2b020ca80d')
),
(
    UUID_TO_BIN('f92c6d37-fd72-47b1-84df-a399749c9a60'),
    'Pod - Collect quarters from 50 US state',
    "Track your quarter collection here, and earn a stamp once you've collected all 50!",
    TRUE, 
    FALSE, 
    NOW(),
    UUID_TO_BIN('985a92b3-c0f3-486a-8d95-1c2b020ca80d')
),
(
    UUID_TO_BIN('79bf8d60-223f-4813-a15b-82726421758b'),
    'Pod - National parks collection',
    "National park enthusiast? You've come to the right place. Record your national park visits here!",
    TRUE, 
    FALSE, 
    NOW(),
    UUID_TO_BIN('985a92b3-c0f3-486a-8d95-1c2b020ca80d')
),
(
    UUID_TO_BIN('8a4ae019-f46b-41c8-bb14-5a230f5cd935'),
    'Pod - PokemonGo Kanto',
    'PokemonGo Kanto collection',
    TRUE, 
    FALSE, 
    NOW(),
    UUID_TO_BIN('985a92b3-c0f3-486a-8d95-1c2b020ca80d')
),
(
    UUID_TO_BIN('0612ca0f-324a-4108-8d09-efa5159b1584'),
    'Pod - PokemonGo Johto',
    'PokemonGo Johto collection',
    TRUE, 
    FALSE, 
    NOW(),
    UUID_TO_BIN('985a92b3-c0f3-486a-8d95-1c2b020ca80d')
),
(
    UUID_TO_BIN('894d33d1-8171-4967-8b8b-b4720ba54ee1'),
    'Pod - PokemonGo Hoenn',
    'PokemonGo Hoenn collection',
    TRUE, 
    FALSE, 
    NOW(),
    UUID_TO_BIN('985a92b3-c0f3-486a-8d95-1c2b020ca80d')
),
(
    UUID_TO_BIN('51dadce7-ed41-42e9-bd64-023c84c6c13d'),
    'mhs class 2015 - Science Olympiad',
    'nationals here we comeeee',
    FALSE, 
    FALSE, 
    NOW(),
    UUID_TO_BIN('985a92b3-c0f3-486a-8d95-1c2b020ca80d')
),
(
    UUID_TO_BIN('43f2693f-e56f-4bd0-84e6-57d5fdeb3dff'),
    'mhs class 2015 - Academic team',
    "What's the capital of Alaska?",
    FALSE, 
    FALSE, 
    NOW(),
    UUID_TO_BIN('985a92b3-c0f3-486a-8d95-1c2b020ca80d')
),
(
    UUID_TO_BIN('3662d552-24f6-42e5-80e8-c3e6c52cdc39'),
    'jack and jill family pod',
    'for da fam',
    FALSE, 
    FALSE, 
    NOW(),
    UUID_TO_BIN('985a92b3-c0f3-486a-8d95-1c2b020ca80d')
),
(
    UUID_TO_BIN('41de4032-68e9-409f-b9e4-f79deeb4e0a9'),
    'universe of bots',
    'hello world everyone',
    TRUE, 
    FALSE, 
    NOW(),
    UUID_TO_BIN('985a92b3-c0f3-486a-8d95-1c2b020ca80d')
);
