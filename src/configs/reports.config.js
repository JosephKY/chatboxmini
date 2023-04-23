let config = {
    "rules":{
        "Violent Speech":[
            "Threatening Violence",
            "Promoting Violence",
            "Using Violent Speech to Intimidate or Harass"
        ],
        "Violent and Hateful Entities":[
            "Promoting Hate Groups",
            "Promoting Terrorist Organizations",
            "Planning or Coordinating Violent or Hateful Activities",
            "Praising or Worshiping Perpetrators of Violent Attacks",
            
        ],
        "Child Safety":[
            "Sharing Explicit Content that Depicts Minors",
            "Promoting Sexual Abuse of Minors",
            "Soliciting Explicit Content that Depicts Minors"
        ],
        "Abuse and Harassment":[
            "Targeting or Harassing Users",
            "Using Derogatory Language or Slurs",
            "Posting Unauthorized Videos or Images",
            "Impersonating an Individual or Organization"
        ],
        "Hateful Conduct":[
            "Promoting Hate Speech",
            "Engaging in Hate Speech",
            "Promoting Eugenics",
            "Misgendering or Deadnaming On Purpose",
            "Dehumanizing a Group of People",
            "Sharing Hateful Insignia or Symbols",
        ],
        "Suicide and Self-Harm":[
            "Encouraging Suicide or Self-Harm",
            "Sharing Graphic Content Related to Suicide or Self-Harm",
            "Providing Instructions or Methods of Suicide or Self-Harm",
            "User is Considering Suicide or Self-Harm"
        ],
        "Sensitive Media":[
            "Posting Content Intended to Shock or Traumatize",
            "Sharing Extremely Violent Content",
            "Sharing Graphic Content Related to Violent Attacks"
        ],
        "Illegal Conduct":[
            "Buying or Selling Illegal Goods and Services",
            "Encouraging or Facilitating Illegal Activity",
            "Promoting or Sharing Content Related to Illegal Activities",
            "Violating Intellectual Property Rights",
            "Attempting to Scam Users or Share Scams",
            "Impersonating an Individual or Organization",
            "Sharing Methods on How to Break the Law"
        ],
        "Private Information":[
            "Leaking Private Information or Doxxing",
            "Sharing Unauthorized Photos or Images",
            "Collecting Private Information"
        ],
        "Non-Consent":[
            "Sharing Unauthorized Photos and Videos",
            "Sharing Revenge Porn or Other Content Intended to Humiliate",
            "Sharing Explicit Content of Minors"
        ],
        "Hacking and Platform Safety":[
            "Account is Compromised",
            "Attempting to Hack into Accounts or the Platform",
            "Sharing Malware",
            "Sharing Dangerous Links",
            "Sharing Methods or Software Designed for Hacking",
            "Reserving Usernames or Selling Accounts"
        ],
        "Misinformation and Disinformation":[
            "Spreading False Information",
            "Spreading Propaganda",
            "Sharing False Information about Elections or Political Events",
            "Disrupting Protests or Rallies",
            "Interfering with Elections or Democratic Processes",
            "Sharing Manipulated Images or Videos Intended to Deceive or Mislead",
            "Using Deepfake Technology to Deceive or Mislead"
        ],
        "Copyright":[
            "Infringing on an Individual or Organization's Copyright or Trademark",
            "Promoting Counterfeit Goods or Services",
            "Sharing Content that Promotes Piracy"
        ],
        "Spam":[
            "General Spam and Unwanted Content",
            "Promoting Scams",
            "Advertising Without Permission",
            "Using Automated Accounts/Bots",
            "Fake Engagement and Platform Manipulation",
            "Reserving Usernames or Selling Accounts"
        ]
    },
    "types":["user","post"]
}

module.exports = rules