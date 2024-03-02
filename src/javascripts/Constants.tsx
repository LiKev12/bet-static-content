export default class Constants {
    extraVar: string = 'filler'; // to combat eslint "Unexpected class with only static properties"

    // general response
    static RESPONSE_STATE_UNSTARTED = 'RESPONSE_STATE_UNSTARTED';
    static RESPONSE_STATE_LOADING = 'RESPONSE_STATE_LOADING';
    static RESPONSE_STATE_ERROR = 'RESPONSE_STATE_ERROR';
    static RESPONSE_STATE_SUCCESS = 'RESPONSE_STATE_SUCCESS';
    static RESPONSE_DEFAULT_ERROR_MESSAGE =
        'We apologize for the inconvenience. We are working to fix this issue as soon as possible. Thank you.';

    static RESPONSE_ERROR_CODE_TO_ERROR_MESSAGE_MAP: Record<string, string> = {
        POD_DUPLICATE_NAME: 'Pod with same name already exists. Please choose another name.',
        STAMP_DUPLICATE_NAME: 'Stamp with same name already exists. Please choose another name.',
        USER_DUPLICATE_USERNAME: 'User with same username already exists. Please choose another username.',
    };

    static RESPONSE_GET_ERROR_MESSAGE = (errorCode: string | null): string => {
        if (errorCode === null || errorCode === undefined || errorCode === 'No message available') {
            // FYI: throw new Exception() returns a message: 'No message available'
            return Constants.RESPONSE_DEFAULT_ERROR_MESSAGE;
        }
        if (!Object.keys(Constants.RESPONSE_ERROR_CODE_TO_ERROR_MESSAGE_MAP).includes(errorCode)) {
            return Constants.RESPONSE_DEFAULT_ERROR_MESSAGE;
        }
        return Constants.RESPONSE_ERROR_CODE_TO_ERROR_MESSAGE_MAP[errorCode];
    };

    // TASK
    static TASK_NAME_MIN_LENGTH_CHARACTERS = 1;
    static TASK_NAME_MAX_LENGTH_CHARACTERS = 100;
    static TASK_DESCRIPTION_MIN_LENGTH_CHARACTERS = 1;
    static TASK_DESCRIPTION_MAX_LENGTH_CHARACTERS = 1000;
    static TASK_NOTE_TEXT_MIN_LENGTH_CHARACTERS = 1;
    static TASK_NOTE_TEXT_MAX_LENGTH_CHARACTERS = 1000;
    static TASK_NUMBER_OF_POINTS_MIN = -1000;
    static TASK_NUMBER_OF_POINTS_MAX = 1000;
    static TASK_COMMENT_TASK_REPLY_MAX_LENGTH_CHARACTERS = 200;
    static REACTION_TYPE_LIKE = 'LIKE';
    static REACTION_TYPE_LOVE = 'LOVE';
    static REACTION_TYPE_LAUGH = 'LAUGH';
    static REACTION_TYPE_WOW = 'WOW';
    static REACTION_TYPE_SAD = 'SAD';
    static REACTION_TYPE_ANGRY = 'ANGRY';
    static REACTION_TYPES = [
        Constants.REACTION_TYPE_LIKE,
        Constants.REACTION_TYPE_LOVE,
        Constants.REACTION_TYPE_LAUGH,
        Constants.REACTION_TYPE_WOW,
        Constants.REACTION_TYPE_SAD,
        Constants.REACTION_TYPE_ANGRY,
    ];

    static GET_EMOJI_HTML_FROM_REACTION = (reactionType: string): any => {
        if (reactionType === Constants.REACTION_TYPE_LIKE) {
            return String.fromCodePoint(parseInt('1F44D', 16));
        } else if (reactionType === Constants.REACTION_TYPE_LOVE) {
            return String.fromCodePoint(parseInt('2764', 16), parseInt('FE0F', 16));
        } else if (reactionType === Constants.REACTION_TYPE_LAUGH) {
            return String.fromCodePoint(parseInt('1F606', 16));
        } else if (reactionType === Constants.REACTION_TYPE_WOW) {
            return String.fromCodePoint(parseInt('1F62E', 16));
        } else if (reactionType === Constants.REACTION_TYPE_SAD) {
            return String.fromCodePoint(parseInt('1F622', 16));
        } else if (reactionType === Constants.REACTION_TYPE_ANGRY) {
            return String.fromCodePoint(parseInt('1F620', 16));
        }
        return null;
    };

    static TASK_INPUT_NAME_HELPER_TEXT = (numChars: number): string =>
        `Task name must be between ${Constants.TASK_NAME_MIN_LENGTH_CHARACTERS}-${
            Constants.TASK_NAME_MAX_LENGTH_CHARACTERS
        } chars, inclusive (${numChars.toString()} chars currently).`;

    static TASK_INPUT_DESCRIPTION_HELPER_TEXT = (numChars: number): string =>
        `Task description must be less than ${
            Constants.TASK_DESCRIPTION_MAX_LENGTH_CHARACTERS
        } chars, inclusive (${numChars.toString()} chars currently).`;

    static TASK_INPUT_NOTE_TEXT_HELPER_TEXT = (numChars: number): string =>
        `Task note must be less than ${
            Constants.TASK_NOTE_TEXT_MAX_LENGTH_CHARACTERS
        } chars, inclusive (${numChars.toString()} chars currently).`;

    static TASK_COMMENT_TEXT_HELPER_TEXT = (numChars: number): string =>
        `Select a comment to post a reply. Deselect comment to post a new comment. Comment must be less than ${
            Constants.TASK_COMMENT_TASK_REPLY_MAX_LENGTH_CHARACTERS
        } chars, inclusive (${numChars.toString()} chars currently).`;

    static INPUT_NUMBER_OF_POINTS_HELPER_TEXT = `Task points must be between ${Constants.TASK_NUMBER_OF_POINTS_MIN} to ${Constants.TASK_NUMBER_OF_POINTS_MAX}, inclusive.`;

    // POD
    static POD_NAME_MIN_LENGTH_CHARACTERS = 3;
    static POD_NAME_MAX_LENGTH_CHARACTERS = 50;
    static POD_DESCRIPTION_MIN_LENGTH_CHARACTERS = 1;
    static POD_DESCRIPTION_MAX_LENGTH_CHARACTERS = 1000;

    static POD_INPUT_NAME_HELPER_TEXT = (numChars: number): string =>
        `Pod name must be between ${Constants.POD_NAME_MIN_LENGTH_CHARACTERS}-${
            Constants.POD_NAME_MAX_LENGTH_CHARACTERS
        } chars, inclusive (${numChars.toString()} chars currently).`;

    static POD_INPUT_DESCRIPTION_HELPER_TEXT = (numChars: number): string =>
        `Pod description must be less than ${
            Constants.POD_DESCRIPTION_MAX_LENGTH_CHARACTERS
        } chars, inclusive (${numChars.toString()} chars currently).`;

    // STAMP
    static STAMP_NAME_MIN_LENGTH_CHARACTERS = 3;
    static STAMP_NAME_MAX_LENGTH_CHARACTERS = 50;
    static STAMP_DESCRIPTION_MIN_LENGTH_CHARACTERS = 1;
    static STAMP_DESCRIPTION_MAX_LENGTH_CHARACTERS = 1000;

    static STAMP_INPUT_NAME_HELPER_TEXT = (numChars: number): string =>
        `Stamp name must be between ${Constants.STAMP_NAME_MIN_LENGTH_CHARACTERS}-${
            Constants.STAMP_NAME_MAX_LENGTH_CHARACTERS
        } chars, inclusive (${numChars.toString()} chars currently).`;

    static STAMP_INPUT_DESCRIPTION_HELPER_TEXT = (numChars: number): string =>
        `Stamp description must be less than ${
            Constants.STAMP_DESCRIPTION_MAX_LENGTH_CHARACTERS
        } chars, inclusive (${numChars.toString()} chars currently).`;

    // USER
    static USER_USERNAME_MIN_LENGTH_CHARACTERS = 3;
    static USER_USERNAME_MAX_LENGTH_CHARACTERS = 30;
    static USER_PASSWORD_MIN_LENGTH_CHARACTERS = 6;
    static USER_NAME_MIN_LENGTH_CHARACTERS = 3;
    static USER_NAME_MAX_LENGTH_CHARACTERS = 50;
    static USER_BIO_MIN_LENGTH_CHARACTERS = 1;
    static USER_BIO_MAX_LENGTH_CHARACTERS = 1000;
    static FORGOT_PASSWORD_SECRET_CODE_LENGTH_CHARACTERS = 8;

    static USER_INPUT_USERNAME_HELPER_TEXT = (numChars: number): string =>
        `Username must be between ${Constants.USER_USERNAME_MIN_LENGTH_CHARACTERS}-${
            Constants.USER_USERNAME_MAX_LENGTH_CHARACTERS
        } chars, inclusive (${numChars.toString()} chars currently). Alphanumeric and underscores only.`;

    static USER_INPUT_NAME_HELPER_TEXT = (numChars: number): string =>
        `Name must be between ${Constants.USER_NAME_MIN_LENGTH_CHARACTERS}-${
            Constants.USER_NAME_MAX_LENGTH_CHARACTERS
        } chars, inclusive (${numChars.toString()} chars currently).`;

    static USER_INPUT_BIO_HELPER_TEXT = (numChars: number): string =>
        `User bio must be less than ${
            Constants.USER_BIO_MAX_LENGTH_CHARACTERS
        } chars, inclusive (${numChars.toString()} chars currently).`;

    static USER_SIGN_UP_INPUT_USERNAME_HELPER_TEXT = (numChars: number): string =>
        `${Constants.USER_USERNAME_MIN_LENGTH_CHARACTERS}-${
            Constants.USER_USERNAME_MAX_LENGTH_CHARACTERS
        } chars, inclusive (${numChars.toString()} chars currently). Alphanumeric and underscores only.`;

    static USER_SIGN_UP_INPUT_PASSWORD_HELPER_TEXT = (numChars: number): string =>
        `At least ${Constants.USER_PASSWORD_MIN_LENGTH_CHARACTERS} chars (${numChars.toString()} chars currently)`;

    static USER_SIGN_UP_INPUT_NAME_HELPER_TEXT = (numChars: number): string =>
        `${Constants.USER_NAME_MIN_LENGTH_CHARACTERS}-${
            Constants.USER_NAME_MAX_LENGTH_CHARACTERS
        } chars, inclusive (${numChars.toString()} chars currently).`;

    static NOTIFICATION_TYPE_SENT_YOU_JOIN_POD_INVITE = 'NOTIFICATION_TYPE_SENT_YOU_JOIN_POD_INVITE';
    static NOTIFICATION_TYPE_APPROVED_YOUR_BECOME_POD_MODERATOR_REQUEST =
        'NOTIFICATION_TYPE_APPROVED_YOUR_BECOME_POD_MODERATOR_REQUEST';

    static NOTIFICATION_TYPE_ADDED_YOU_AS_POD_MODERATOR = 'NOTIFICATION_TYPE_ADDED_YOU_AS_POD_MODERATOR';
    static NOTIFICATION_TYPE_SENT_YOU_FOLLOW_REQUEST = 'NOTIFICATION_TYPE_SENT_YOU_FOLLOW_REQUEST';
    static NOTIFICATION_TYPE_ACCEPTED_YOUR_FOLLOW_REQUEST = 'NOTIFICATION_TYPE_ACCEPTED_YOUR_FOLLOW_REQUEST';
    static NOTIFICATION_LINK_PAGE_TYPE_POD = 'POD';
    static NOTIFICATION_LINK_PAGE_TYPE_USER = 'USER';
    static NOTIFICATION_LINK_PAGE_TYPE_STAMP = 'STAMP';

    static HEADER_ACTIVE_TAB_IDX__NO_ACTIVE_TAB = -1;
    static HEADER_ACTIVE_TAB_IDX__PAGE_PERSONAL = 0;
    static HEADER_ACTIVE_TAB_IDX__PAGE_DISCOVER = 1;
    static HEADER_ACTIVE_TAB_IDX__PAGE_USER = 2;
    static HEADER_ACTIVE_TAB_IDX__PAGE_ACCOUNT_SETTINGS = 3;

    static REGEX_USER_USERNAME = /^\w+$/;
    static REGEX_USER_EMAIL = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    static PAGINATION_BATCH_N = 5;
    static PAGE_SIZE_POD_CARDS_DISCOVER_PAGE = 10;
    static PAGE_SIZE_POD_CARDS_ASSOCIATED_WITH_STAMP = 10;
    static PAGE_SIZE_POD_CARDS_ASSOCIATED_WITH_USER = 10;
    static PAGE_SIZE_STAMP_CARDS_DISCOVER_PAGE = 10;
    static PAGE_SIZE_STAMP_CARDS_ASSOCIATED_WITH_POD = 10;
    static PAGE_SIZE_STAMP_CARDS_ASSOCIATED_WITH_USER = 10;
    static TIME_ZONE_CHOICES = [
        'Africa/Abidjan',
        'Africa/Accra',
        'Africa/Addis_Ababa',
        'Africa/Algiers',
        'Africa/Asmara',
        'Africa/Asmera',
        'Africa/Bamako',
        'Africa/Bangui',
        'Africa/Banjul',
        'Africa/Bissau',
        'Africa/Blantyre',
        'Africa/Brazzaville',
        'Africa/Bujumbura',
        'Africa/Cairo',
        'Africa/Casablanca',
        'Africa/Ceuta',
        'Africa/Conakry',
        'Africa/Dakar',
        'Africa/Dar_es_Salaam',
        'Africa/Djibouti',
        'Africa/Douala',
        'Africa/El_Aaiun',
        'Africa/Freetown',
        'Africa/Gaborone',
        'Africa/Harare',
        'Africa/Johannesburg',
        'Africa/Juba',
        'Africa/Kampala',
        'Africa/Khartoum',
        'Africa/Kigali',
        'Africa/Kinshasa',
        'Africa/Lagos',
        'Africa/Libreville',
        'Africa/Lome',
        'Africa/Luanda',
        'Africa/Lubumbashi',
        'Africa/Lusaka',
        'Africa/Malabo',
        'Africa/Maputo',
        'Africa/Maseru',
        'Africa/Mbabane',
        'Africa/Mogadishu',
        'Africa/Monrovia',
        'Africa/Nairobi',
        'Africa/Ndjamena',
        'Africa/Niamey',
        'Africa/Nouakchott',
        'Africa/Ouagadougou',
        'Africa/Porto-Novo',
        'Africa/Sao_Tome',
        'Africa/Timbuktu',
        'Africa/Tripoli',
        'Africa/Tunis',
        'Africa/Windhoek',
        'America/Adak',
        'America/Anchorage',
        'America/Anguilla',
        'America/Antigua',
        'America/Araguaina',
        'America/Argentina/Buenos_Aires',
        'America/Argentina/Catamarca',
        'America/Argentina/ComodRivadavia',
        'America/Argentina/Cordoba',
        'America/Argentina/Jujuy',
        'America/Argentina/La_Rioja',
        'America/Argentina/Mendoza',
        'America/Argentina/Rio_Gallegos',
        'America/Argentina/Salta',
        'America/Argentina/San_Juan',
        'America/Argentina/San_Luis',
        'America/Argentina/Tucuman',
        'America/Argentina/Ushuaia',
        'America/Aruba',
        'America/Asuncion',
        'America/Atikokan',
        'America/Atka',
        'America/Bahia',
        'America/Bahia_Banderas',
        'America/Barbados',
        'America/Belem',
        'America/Belize',
        'America/Blanc-Sablon',
        'America/Boa_Vista',
        'America/Bogota',
        'America/Boise',
        'America/Buenos_Aires',
        'America/Cambridge_Bay',
        'America/Campo_Grande',
        'America/Cancun',
        'America/Caracas',
        'America/Catamarca',
        'America/Cayenne',
        'America/Cayman',
        'America/Chicago',
        'America/Chihuahua',
        'America/Ciudad_Juarez',
        'America/Coral_Harbour',
        'America/Cordoba',
        'America/Costa_Rica',
        'America/Creston',
        'America/Cuiaba',
        'America/Curacao',
        'America/Danmarkshavn',
        'America/Dawson',
        'America/Dawson_Creek',
        'America/Denver',
        'America/Detroit',
        'America/Dominica',
        'America/Edmonton',
        'America/Eirunepe',
        'America/El_Salvador',
        'America/Ensenada',
        'America/Fort_Nelson',
        'America/Fort_Wayne',
        'America/Fortaleza',
        'America/Glace_Bay',
        'America/Godthab',
        'America/Goose_Bay',
        'America/Grand_Turk',
        'America/Grenada',
        'America/Guadeloupe',
        'America/Guatemala',
        'America/Guayaquil',
        'America/Guyana',
        'America/Halifax',
        'America/Havana',
        'America/Hermosillo',
        'America/Indiana/Indianapolis',
        'America/Indiana/Knox',
        'America/Indiana/Marengo',
        'America/Indiana/Petersburg',
        'America/Indiana/Tell_City',
        'America/Indiana/Vevay',
        'America/Indiana/Vincennes',
        'America/Indiana/Winamac',
        'America/Indianapolis',
        'America/Inuvik',
        'America/Iqaluit',
        'America/Jamaica',
        'America/Jujuy',
        'America/Juneau',
        'America/Kentucky/Louisville',
        'America/Kentucky/Monticello',
        'America/Knox_IN',
        'America/Kralendijk',
        'America/La_Paz',
        'America/Lima',
        'America/Los_Angeles',
        'America/Louisville',
        'America/Lower_Princes',
        'America/Maceio',
        'America/Managua',
        'America/Manaus',
        'America/Marigot',
        'America/Martinique',
        'America/Matamoros',
        'America/Mazatlan',
        'America/Mendoza',
        'America/Menominee',
        'America/Merida',
        'America/Metlakatla',
        'America/Mexico_City',
        'America/Miquelon',
        'America/Moncton',
        'America/Monterrey',
        'America/Montevideo',
        'America/Montreal',
        'America/Montserrat',
        'America/Nassau',
        'America/New_York',
        'America/Nipigon',
        'America/Nome',
        'America/Noronha',
        'America/North_Dakota/Beulah',
        'America/North_Dakota/Center',
        'America/North_Dakota/New_Salem',
        'America/Nuuk',
        'America/Ojinaga',
        'America/Panama',
        'America/Pangnirtung',
        'America/Paramaribo',
        'America/Phoenix',
        'America/Port-au-Prince',
        'America/Port_of_Spain',
        'America/Porto_Acre',
        'America/Porto_Velho',
        'America/Puerto_Rico',
        'America/Punta_Arenas',
        'America/Rainy_River',
        'America/Rankin_Inlet',
        'America/Recife',
        'America/Regina',
        'America/Resolute',
        'America/Rio_Branco',
        'America/Rosario',
        'America/Santa_Isabel',
        'America/Santarem',
        'America/Santiago',
        'America/Santo_Domingo',
        'America/Sao_Paulo',
        'America/Scoresbysund',
        'America/Shiprock',
        'America/Sitka',
        'America/St_Barthelemy',
        'America/St_Johns',
        'America/St_Kitts',
        'America/St_Lucia',
        'America/St_Thomas',
        'America/St_Vincent',
        'America/Swift_Current',
        'America/Tegucigalpa',
        'America/Thule',
        'America/Thunder_Bay',
        'America/Tijuana',
        'America/Toronto',
        'America/Tortola',
        'America/Vancouver',
        'America/Virgin',
        'America/Whitehorse',
        'America/Winnipeg',
        'America/Yakutat',
        'America/Yellowknife',
        'Antarctica/Casey',
        'Antarctica/Davis',
        'Antarctica/DumontDUrville',
        'Antarctica/Macquarie',
        'Antarctica/Mawson',
        'Antarctica/McMurdo',
        'Antarctica/Palmer',
        'Antarctica/Rothera',
        'Antarctica/South_Pole',
        'Antarctica/Syowa',
        'Antarctica/Troll',
        'Antarctica/Vostok',
        'Arctic/Longyearbyen',
        'Asia/Aden',
        'Asia/Almaty',
        'Asia/Amman',
        'Asia/Anadyr',
        'Asia/Aqtau',
        'Asia/Aqtobe',
        'Asia/Ashgabat',
        'Asia/Ashkhabad',
        'Asia/Atyrau',
        'Asia/Baghdad',
        'Asia/Bahrain',
        'Asia/Baku',
        'Asia/Bangkok',
        'Asia/Barnaul',
        'Asia/Beirut',
        'Asia/Bishkek',
        'Asia/Brunei',
        'Asia/Calcutta',
        'Asia/Chita',
        'Asia/Choibalsan',
        'Asia/Chongqing',
        'Asia/Chungking',
        'Asia/Colombo',
        'Asia/Dacca',
        'Asia/Damascus',
        'Asia/Dhaka',
        'Asia/Dili',
        'Asia/Dubai',
        'Asia/Dushanbe',
        'Asia/Famagusta',
        'Asia/Gaza',
        'Asia/Harbin',
        'Asia/Hebron',
        'Asia/Ho_Chi_Minh',
        'Asia/Hong_Kong',
        'Asia/Hovd',
        'Asia/Irkutsk',
        'Asia/Istanbul',
        'Asia/Jakarta',
        'Asia/Jayapura',
        'Asia/Jerusalem',
        'Asia/Kabul',
        'Asia/Kamchatka',
        'Asia/Karachi',
        'Asia/Kashgar',
        'Asia/Kathmandu',
        'Asia/Katmandu',
        'Asia/Khandyga',
        'Asia/Kolkata',
        'Asia/Krasnoyarsk',
        'Asia/Kuala_Lumpur',
        'Asia/Kuching',
        'Asia/Kuwait',
        'Asia/Macao',
        'Asia/Macau',
        'Asia/Magadan',
        'Asia/Makassar',
        'Asia/Manila',
        'Asia/Muscat',
        'Asia/Nicosia',
        'Asia/Novokuznetsk',
        'Asia/Novosibirsk',
        'Asia/Omsk',
        'Asia/Oral',
        'Asia/Phnom_Penh',
        'Asia/Pontianak',
        'Asia/Pyongyang',
        'Asia/Qatar',
        'Asia/Qostanay',
        'Asia/Qyzylorda',
        'Asia/Rangoon',
        'Asia/Riyadh',
        'Asia/Saigon',
        'Asia/Sakhalin',
        'Asia/Samarkand',
        'Asia/Seoul',
        'Asia/Shanghai',
        'Asia/Singapore',
        'Asia/Srednekolymsk',
        'Asia/Taipei',
        'Asia/Tashkent',
        'Asia/Tbilisi',
        'Asia/Tehran',
        'Asia/Tel_Aviv',
        'Asia/Thimbu',
        'Asia/Thimphu',
        'Asia/Tokyo',
        'Asia/Tomsk',
        'Asia/Ujung_Pandang',
        'Asia/Ulaanbaatar',
        'Asia/Ulan_Bator',
        'Asia/Urumqi',
        'Asia/Ust-Nera',
        'Asia/Vientiane',
        'Asia/Vladivostok',
        'Asia/Yakutsk',
        'Asia/Yangon',
        'Asia/Yekaterinburg',
        'Asia/Yerevan',
        'Atlantic/Azores',
        'Atlantic/Bermuda',
        'Atlantic/Canary',
        'Atlantic/Cape_Verde',
        'Atlantic/Faeroe',
        'Atlantic/Faroe',
        'Atlantic/Jan_Mayen',
        'Atlantic/Madeira',
        'Atlantic/Reykjavik',
        'Atlantic/South_Georgia',
        'Atlantic/St_Helena',
        'Atlantic/Stanley',
        'Australia/ACT',
        'Australia/Adelaide',
        'Australia/Brisbane',
        'Australia/Broken_Hill',
        'Australia/Canberra',
        'Australia/Currie',
        'Australia/Darwin',
        'Australia/Eucla',
        'Australia/Hobart',
        'Australia/LHI',
        'Australia/Lindeman',
        'Australia/Lord_Howe',
        'Australia/Melbourne',
        'Australia/NSW',
        'Australia/North',
        'Australia/Perth',
        'Australia/Queensland',
        'Australia/South',
        'Australia/Sydney',
        'Australia/Tasmania',
        'Australia/Victoria',
        'Australia/West',
        'Australia/Yancowinna',
        'Brazil/Acre',
        'Brazil/DeNoronha',
        'Brazil/East',
        'Brazil/West',
        'CET',
        'CST6CDT',
        'Canada/Atlantic',
        'Canada/Central',
        'Canada/Eastern',
        'Canada/Mountain',
        'Canada/Newfoundland',
        'Canada/Pacific',
        'Canada/Saskatchewan',
        'Canada/Yukon',
        'Chile/Continental',
        'Chile/EasterIsland',
        'Cuba',
        'EET',
        'EST5EDT',
        'Egypt',
        'Eire',
        'Etc/GMT',
        'Etc/GMT+0',
        'Etc/GMT+1',
        'Etc/GMT+10',
        'Etc/GMT+11',
        'Etc/GMT+12',
        'Etc/GMT+2',
        'Etc/GMT+3',
        'Etc/GMT+4',
        'Etc/GMT+5',
        'Etc/GMT+6',
        'Etc/GMT+7',
        'Etc/GMT+8',
        'Etc/GMT+9',
        'Etc/GMT-0',
        'Etc/GMT-1',
        'Etc/GMT-10',
        'Etc/GMT-11',
        'Etc/GMT-12',
        'Etc/GMT-13',
        'Etc/GMT-14',
        'Etc/GMT-2',
        'Etc/GMT-3',
        'Etc/GMT-4',
        'Etc/GMT-5',
        'Etc/GMT-6',
        'Etc/GMT-7',
        'Etc/GMT-8',
        'Etc/GMT-9',
        'Etc/GMT0',
        'Etc/Greenwich',
        'Etc/UCT',
        'Etc/UTC',
        'Etc/Universal',
        'Etc/Zulu',
        'Europe/Amsterdam',
        'Europe/Andorra',
        'Europe/Astrakhan',
        'Europe/Athens',
        'Europe/Belfast',
        'Europe/Belgrade',
        'Europe/Berlin',
        'Europe/Bratislava',
        'Europe/Brussels',
        'Europe/Bucharest',
        'Europe/Budapest',
        'Europe/Busingen',
        'Europe/Chisinau',
        'Europe/Copenhagen',
        'Europe/Dublin',
        'Europe/Gibraltar',
        'Europe/Guernsey',
        'Europe/Helsinki',
        'Europe/Isle_of_Man',
        'Europe/Istanbul',
        'Europe/Jersey',
        'Europe/Kaliningrad',
        'Europe/Kiev',
        'Europe/Kirov',
        'Europe/Kyiv',
        'Europe/Lisbon',
        'Europe/Ljubljana',
        'Europe/London',
        'Europe/Luxembourg',
        'Europe/Madrid',
        'Europe/Malta',
        'Europe/Mariehamn',
        'Europe/Minsk',
        'Europe/Monaco',
        'Europe/Moscow',
        'Europe/Nicosia',
        'Europe/Oslo',
        'Europe/Paris',
        'Europe/Podgorica',
        'Europe/Prague',
        'Europe/Riga',
        'Europe/Rome',
        'Europe/Samara',
        'Europe/San_Marino',
        'Europe/Sarajevo',
        'Europe/Saratov',
        'Europe/Simferopol',
        'Europe/Skopje',
        'Europe/Sofia',
        'Europe/Stockholm',
        'Europe/Tallinn',
        'Europe/Tirane',
        'Europe/Tiraspol',
        'Europe/Ulyanovsk',
        'Europe/Uzhgorod',
        'Europe/Vaduz',
        'Europe/Vatican',
        'Europe/Vienna',
        'Europe/Vilnius',
        'Europe/Volgograd',
        'Europe/Warsaw',
        'Europe/Zagreb',
        'Europe/Zaporozhye',
        'Europe/Zurich',
        'GB',
        'GB-Eire',
        'GMT',
        'GMT0',
        'Greenwich',
        'Hongkong',
        'Iceland',
        'Indian/Antananarivo',
        'Indian/Chagos',
        'Indian/Christmas',
        'Indian/Cocos',
        'Indian/Comoro',
        'Indian/Kerguelen',
        'Indian/Mahe',
        'Indian/Maldives',
        'Indian/Mauritius',
        'Indian/Mayotte',
        'Indian/Reunion',
        'Iran',
        'Israel',
        'Jamaica',
        'Japan',
        'Kwajalein',
        'Libya',
        'MET',
        'MST7MDT',
        'Mexico/BajaNorte',
        'Mexico/BajaSur',
        'Mexico/General',
        'NZ',
        'NZ-CHAT',
        'Navajo',
        'PRC',
        'PST8PDT',
        'Pacific/Apia',
        'Pacific/Auckland',
        'Pacific/Bougainville',
        'Pacific/Chatham',
        'Pacific/Chuuk',
        'Pacific/Easter',
        'Pacific/Efate',
        'Pacific/Enderbury',
        'Pacific/Fakaofo',
        'Pacific/Fiji',
        'Pacific/Funafuti',
        'Pacific/Galapagos',
        'Pacific/Gambier',
        'Pacific/Guadalcanal',
        'Pacific/Guam',
        'Pacific/Honolulu',
        'Pacific/Johnston',
        'Pacific/Kanton',
        'Pacific/Kiritimati',
        'Pacific/Kosrae',
        'Pacific/Kwajalein',
        'Pacific/Majuro',
        'Pacific/Marquesas',
        'Pacific/Midway',
        'Pacific/Nauru',
        'Pacific/Niue',
        'Pacific/Norfolk',
        'Pacific/Noumea',
        'Pacific/Pago_Pago',
        'Pacific/Palau',
        'Pacific/Pitcairn',
        'Pacific/Pohnpei',
        'Pacific/Ponape',
        'Pacific/Port_Moresby',
        'Pacific/Rarotonga',
        'Pacific/Saipan',
        'Pacific/Samoa',
        'Pacific/Tahiti',
        'Pacific/Tarawa',
        'Pacific/Tongatapu',
        'Pacific/Truk',
        'Pacific/Wake',
        'Pacific/Wallis',
        'Pacific/Yap',
        'Poland',
        'Portugal',
        'ROK',
        'Singapore',
        'SystemV/AST4',
        'SystemV/AST4ADT',
        'SystemV/CST6',
        'SystemV/CST6CDT',
        'SystemV/EST5',
        'SystemV/EST5EDT',
        'SystemV/HST10',
        'SystemV/MST7',
        'SystemV/MST7MDT',
        'SystemV/PST8',
        'SystemV/PST8PDT',
        'SystemV/YST9',
        'SystemV/YST9YDT',
        'Turkey',
        'UCT',
        'US/Alaska',
        'US/Aleutian',
        'US/Arizona',
        'US/Central',
        'US/East-Indiana',
        'US/Eastern',
        'US/Hawaii',
        'US/Indiana-Starke',
        'US/Michigan',
        'US/Mountain',
        'US/Pacific',
        'US/Samoa',
        'UTC',
        'Universal',
        'W-SU',
        'WET',
        'Zulu',
    ];
}
