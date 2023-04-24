let reportConfig = {
    "rules": {
        "Violent Speech": [
            "Threatening Violence",
            "Promoting Violence",
            "Using Violent Speech to Intimidate or Harass"
        ],
        "Violent and Hateful Entities": [
            "Promoting Hate Groups",
            "Promoting Terrorist Organizations",
            "Planning or Coordinating Violent or Hateful Activities",
            "Praising or Worshiping Perpetrators of Violent Attacks",

        ],
        "Child Safety": [
            "Sharing Explicit Content that Depicts Minors",
            "Promoting Sexual Abuse of Minors",
            "Soliciting Explicit Content that Depicts Minors"
        ],
        "Abuse and Harassment": [
            "Targeting or Harassing Users",
            "Using Derogatory Language or Slurs",
            "Posting Unauthorized Videos or Images",
            "Impersonating an Individual or Organization"
        ],
        "Hateful Conduct": [
            "Promoting Hate Speech",
            "Engaging in Hate Speech",
            "Promoting Eugenics",
            "Misgendering or Deadnaming On Purpose",
            "Dehumanizing a Group of People",
            "Sharing Hateful Insignia or Symbols",
        ],
        "Suicide and Self-Harm": [
            "Encouraging Suicide or Self-Harm",
            "Sharing Graphic Content Related to Suicide or Self-Harm",
            "Providing Instructions or Methods of Suicide or Self-Harm",
            "User is Considering Suicide or Self-Harm"
        ],
        "Sensitive Media": [
            "Posting Content Intended to Shock or Traumatize",
            "Sharing Extremely Violent Content",
            "Sharing Graphic Content Related to Violent Attacks"
        ],
        "Illegal Conduct": [
            "Buying or Selling Illegal Goods and Services",
            "Encouraging or Facilitating Illegal Activity",
            "Promoting or Sharing Content Related to Illegal Activities",
            "Violating Intellectual Property Rights",
            "Attempting to Scam Users or Share Scams",
            "Impersonating an Individual or Organization",
            "Sharing Methods on How to Break the Law"
        ],
        "Private Information": [
            "Leaking Private Information or Doxxing",
            "Sharing Unauthorized Photos or Images",
            "Collecting Private Information"
        ],
        "Non-Consent": [
            "Sharing Unauthorized Photos and Videos",
            "Sharing Revenge Porn or Other Content Intended to Humiliate",
            "Sharing Explicit Content of Minors"
        ],
        "Hacking and Platform Safety": [
            "Account is Compromised",
            "Attempting to Hack into Accounts or the Platform",
            "Sharing Malware",
            "Sharing Dangerous Links",
            "Sharing Methods or Software Designed for Hacking",
            "Reserving Usernames or Selling Accounts"
        ],
        "Misinformation and Disinformation": [
            "Spreading False Information",
            "Spreading Propaganda",
            "Sharing False Information about Elections or Political Events",
            "Disrupting Protests or Rallies",
            "Interfering with Elections or Democratic Processes",
            "Sharing Manipulated Images or Videos Intended to Deceive or Mislead",
            "Using Deepfake Technology to Deceive or Mislead"
        ],
        "Copyright": [
            "Infringing on an Individual or Organization's Copyright or Trademark",
            "Promoting Counterfeit Goods or Services",
            "Sharing Content that Promotes Piracy"
        ],
        "Spam": [
            "General Spam and Unwanted Content",
            "Promoting Scams",
            "Advertising Without Permission",
            "Using Automated Accounts/Bots",
            "Fake Engagement and Platform Manipulation",
            "Reserving Usernames or Selling Accounts"
        ]
    },
    "types": ["user", "post"]
}

let params = new URLSearchParams(window.location.search)
let reportType = params.get("type")
let reportTarget = params.get("target")
let reportHint = params.get("hint")
let ruleInputs = document.getElementById("reportRules")
let methodInputsContainer = document.getElementById("reportMethodContainer")
let methodInputs = document.getElementById("reportMethod")
let submitButton = document.getElementById("submitReport")

let selectedRule = undefined;
let selectedMethod = undefined;

if (!reportType || !reportTarget || isNaN(parseInt(reportTarget)) || !reportConfig.types.includes(reportType)) window.location.href = '/'

if (reportHint != undefined) {
    document.getElementById("reportHint").innerHTML = `Reporting: "${reportHint}"`
}

for (let [rule, methods] of Object.entries(reportConfig.rules)) {
    methods.push("Other")

    let ruleInput = document.createElement("input")
    ruleInput.setAttribute("ruleName", rule)
    ruleInput.type = 'radio'
    ruleInput.name = 'reportRule'
    ruleInput.classList.add("reportRuleInput")
    ruleInput.id = rule.replace(/\s+/g, '')

    let ruleInputLabel = document.createElement("label")
    ruleInputLabel.htmlFor = rule.replace(/\s+/g, '')
    ruleInputLabel.innerHTML = rule

    ruleInputs.appendChild(ruleInput)
    ruleInputs.appendChild(ruleInputLabel)
    ruleInputs.appendChild(document.createElement("br"))

    ruleInput.oninput = () => {
        selectedRule = ruleInput

        while (methodInputs.firstChild) {
            methodInputs.removeChild(methodInputs.firstChild)
        }

        document.getElementById("reportCopyright").classList.add("hidden")
        document.getElementById("reportConclusion").classList.add("hidden")

        methods.forEach(method => {
            let methodInput = document.createElement("input")
            methodInput.setAttribute("methodName", method)
            methodInput.type = 'radio'
            methodInput.name = 'reportMethod'
            methodInput.classList.add("reportRuleInput")
            methodInput.id = method.replace(/\s+/g, '')

            let methodInputLabel = document.createElement("label")
            methodInputLabel.htmlFor = method.replace(/\s+/g, '')
            methodInputLabel.innerHTML = method

            methodInputs.appendChild(methodInput)
            methodInputs.appendChild(methodInputLabel)
            methodInputs.appendChild(document.createElement("br"))

            methodInputsContainer.classList.remove("hidden")

            methodInput.oninput = () => {
                selectedMethod = methodInput

                if (method == "Infringing on an Individual or Organization's Copyright or Trademark") {
                    document.getElementById("reportConclusion").classList.add("hidden")
                    document.getElementById("reportCopyright").classList.remove("hidden")
                    return
                }
                document.getElementById("reportCopyright").classList.add("hidden")
                document.getElementById("reportConclusion").classList.remove("hidden")


            }
        })


    }
}

async function app() {
    if (me == null) window.location.href = "/"
}

async function submitReport() {
    try {
        submitButton.disabled = true;

        let rule = selectedRule.getAttribute("ruleName")
        let method = selectedMethod.getAttribute("methodName")

        let res = (await ajax({
            "url": "/api/moderation/reports/create",
            "type": "POST",
            "data": {
                rule: rule,
                method: method,
                relation: reportTarget,
                type: reportType
            }
        }))

        console.log(res)

        if (!res) {
            notification("Something went wrong. Please try again later", 5000);
            return
        }

        if (res.type == 'error') {
            notification(res.data, 5000);
            return
        }

        notification("Report submitted. You'll be redirected momentarily", 5000, green);
        setTimeout(() => { window.location.href = "/" }, 5000)

    } catch (err) {
        notification("Something went wrong. Please try again later", 5000);
    }
}