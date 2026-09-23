// lib/board.js
//
// MFWA governing board, as published on the live site (Sept 2026): names,
// roles, portraits and biographies were read from
// https://mfwa.org/about-us/our-board/ and each member's /team/<slug>/
// page — the same WordPress "team" post type used for lib/staff.js. The
// Executive Director, Sulemana Braimah, sits on the board too; his entry
// here repeats the same photos/bio already used on the staff page rather
// than special-casing him.
//
// Portraits are served straight from the WordPress media library. Several
// of these photos predate the staff portraits and were never cropped to
// the 570×696 ratio used there — .st-card__media / .st-sheet__photo
// already crop with object-fit:cover, so any source ratio works.
//
// Order here is governance hierarchy (chair, then executive director,
// then members); the live page instead lists everyone alphabetically by
// first name.

const U = "https://mfwa.org/wp-content/uploads/";

export const BOARD_ROLES = {
  chair: "Board Chair",
  director: "Executive Director",
  member: "Board Member",
};

export const BOARD = [
  {
    slug: "sophie-ly-sow",
    name: "Sophie Ly Sow",
    role: BOARD_ROLES.chair,
    roleKey: "chair",
    thumb: `${U}2015/12/website-sophie-570x456.jpg`,
    photo: `${U}2015/12/website-sophie-1024x819.jpg`,
    bio: [
      "Mrs. Sophie Ly Sow currently serves as the Director of Dakar based private consulting firm, NEXUS Groupe in Senegal. Mrs. Sow has several years of experience leading and managing non-profits and media related projects. Among many other experiences, Mrs. Sow opened and managed the West Africa office of Panos Institute in Dakar from 1992 to 1994. She served as Secretary General of the World Association of Community Radio Broadcasters (AMARC) in Montreal, Canada, from 1995 to 2001.",
      "From 2005 to 2007, Mrs. Sow was in charge of the Media Programme of the Open Society Initiative for West Africa (OSIWA), and was in charge of Oxfam America’s regional communication from 2007 to 2009.",
    ],
  },
  {
    slug: "sulemana-braimah",
    name: "Sulemana Braimah",
    role: BOARD_ROLES.director,
    roleKey: "director",
    thumb: `${U}2025/07/3-13-570x696.png`,
    photo: `${U}2025/07/3-13-840x1076.png`,
    bio: [
      "Sulemana Braimah is the Executive Director of the Media Foundation for West Africa (MFWA). He has been leading the team at the MFWA since 2014.",
      "He has led and grown the organisation from a small team of seven to over 40 staff and established partnerships with organisations in all 16 countries of West Africa. Under his leadership, the MFWA has: obtained equivalency certification as being an equivalent of a U.S. public charity under section 501(c)(3); attained UN ECOSOC Consultative status; signed MoU to become an official civil society partner of the regional inter-governmental group, ECOWAS; and introduced West Africa’s biggest annual media conference.",
      "His innovation in leadership is reflected in the restructuring of the organisation and the introduction of innovative projects such as: The Fourth Estate, Ghana’s first non-profit, public interest investigative journalism project; Fact-Check Ghana, Ghana’s first fact-checking project; the Next Generation Investigative Journalism Fellowship (NGIJ) to empower young journalists across West Africa; the West Africa Media Excellence Awards, to recognise and promote journalism excellence.",
      "In recognition of his exceptional leadership, Sulemana was named in 2019 as a Global Eisenhower Fellow. In 2023, he was the recipient of the coveted Eisenhower Fellowships Impact Award in recognition of the extraordinary impact of The Fourth Estate non-profit investigative journalism project, which he established in 2021. And under his leadership, the MFWA was named winner of Media and Information category of the World Justice Challenge in 2024.",
      "He is also the current Secretary General of the ECOWAS Civil Society Platform on Transparency and Accountability in Governance (ECSOPTAG); a former member of the Executive Committee of the West Africa Civil Society Forum (WACSOF); member of the Steering Committee of the African Network of Free Expression organisations (AFEX). From 2011 to 2015 he served on the 13-member Governing Council of IFEX, the global network of free expression organisations based in Toronto, Canada.",
      "Sulemana previously worked for five years (2002 – 2007) with The Chronicle newspaper as a reporter and later became the paper’s News Editor. In 2009, while studying at the University of Manitoba, Canada, he was a contributing writer on media and communications issues for suite101.com.",
      "He has been a reviewer of the annual global press freedom ratings (Freedom of the Press Index) by the US-based Freedom House Inc. He has participated in and presented papers on media rights and freedom of expression issues at various national, regional and international conferences.",
      "Sulemana holds MPhil (Communication Studies – best graduating student) and Bachelor of Arts (Sociology with Philosophy – First Class Honours) both from the University of Ghana. In recognition of his academic excellence, he was awarded a Canadian Fellowship programme for studies at the University of Manitoba in Canada, as part of his MPhil studies.",
    ],
  },
  {
    slug: "fatoumata-y-balde",
    name: "Fatoumata Y. Balde",
    role: BOARD_ROLES.member,
    roleKey: "member",
    thumb: `${U}2019/10/website-fatou-1-570x456.jpg`,
    photo: `${U}2019/10/website-fatou-1-1024x819.jpg`,
    bio: [
      "Ms. Fatoumata Yansane Balde is the Executive Director of the Coalition of Women Leaders of Guinea, a body that seeks to empower women in the country. She has previously served as first Vice President of the National Council for Civil Society Organisations in Guinea. She was also a founding member and General Secretary of the Network of Young Women Leaders of Guinea.",
    ],
  },
  {
    slug: "femi-falana",
    name: "Femi Falana",
    role: BOARD_ROLES.member,
    roleKey: "member",
    thumb: `${U}2025/02/Femi-Falana-image-600x474.jpg`,
    photo: `${U}2025/02/Femi-Falana-image-1024x809.jpg`,
    bio: [
      "Femi Falana, a former President of the West Africa Bar Association (WABA), has been at the forefront of defending journalists and other human rights advocates across Africa for over two decades now. He has defended and secured victories for dozens of journalists and activists in Nigerian courtrooms and at the ECOWAS Court.",
      "In 2008 and 2010, he secured landmark victories at the ECOWAS Community Court of Justice against the government of The Gambia for Gambian journalists, Musah Saidykhan and Chief Ebrima Manneh respectively. Saidykhan was a victim of severe torture while Manneh suffered enforced disappearance.",
      "Mr. Falana is currently serving as lawyer for journalist and founder of online publication, Sahara Reporters, Omoyele Sowore, who is being held by the Nigerian authorities. Earlier this year, he secured the release of the Editor and Publisher of The Source Newspaper, Jones Abiri, who had been detained by Nigeria’s State Security Service (SSS) since 2016.",
      "In recognition of his exceptional qualities in, and dedication to, human rights law and criminal law, Mr. Falana was recipient of the International Bar Association’s Bernard Simons Memorial Award in 2008. He has been a keynote speaker at conferences of the ECOWAS Community Court and many other international legal convenings.",
    ],
  },
  {
    slug: "hilda-r-m-teofilo",
    name: "Hilda R.M. Teófilo",
    role: BOARD_ROLES.member,
    roleKey: "member",
    thumb: `${U}2019/10/website-hilda-1-570x456.jpg`,
    photo: `${U}2019/10/website-hilda-1-1024x819.jpg`,
    bio: [
      "Ms. Hilda Regina Melício Teófilo is a Cape Verdian media expert with extensive background in new and traditional media as well as telecommunications. She has over the years worked with Portugese telecommunications giant PT Comunicações and managed a number of major communications websites.",
      "Ms. Teófilo is currently is the General Manager for PT Comunicações web portal SAPO.CV. She had also previously worked with Portugal-based radio station RDP África where she produced and hosted radio shows for all Portuguese speaking countries in Africa.",
    ],
  },
  {
    slug: "kwame-karikari",
    name: "Prof. Kwame Karikari",
    role: BOARD_ROLES.member,
    roleKey: "member",
    thumb: `${U}2023/05/IMG_9883-600x400.jpg`,
    photo: `${U}2023/05/IMG_9883-1024x683.jpg`,
    bio: [
      "Professor Kwame Karikari is the former Executive Director of the MFWA. He has been for several years, a professor in journalism and mass communication at the School of Communication Studies at the University of Ghana. He has also been involved in training journalists in several countries in Africa over the years.",
      "Prior to that and during all those years, he practiced as a journalist, including serving as director general of the public Ghana Broadcasting Corporation in the early 1980s. He has also been an activist pursuing social justice and human rights causes, in Africa, including democratic reforms in Ghana. He serves on the boards of a number of African and international rights organisations and on the editorial boards of academic publications.",
      "He was educated at the City College of New York and Columbia University in New York.",
    ],
  },
];
