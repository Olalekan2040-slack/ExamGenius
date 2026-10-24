/**
 * Commerce Learning Content — JAMB
 * Topic keys and subtopic names match syllabus/parsed/commerce_syllabus.json.
 */

const COMMERCE_LEARNING_CONTENT = {

  "Nature and Scope of Commerce": {
    subject: "Commerce",
    topic: "Nature and Scope of Commerce",
    introduction: {
      title: "Nature and Scope of Commerce",
      description: "Commerce is concerned with the distribution and exchange of goods and services and the activities that aid this exchange. This foundation topic defines commerce, its divisions and its importance.",
      jambInfo: "2-3 opening questions, usually on the divisions of commerce and aids to trade."
    },
    subtopics: [
      {
        name: "Meaning, Scope and Functions of Commerce",
        objectives: [
          {
            title: "Define commerce and identify its divisions",
            explanation: `<p><strong>Commerce</strong> is the sum total of activities involved in the buying, selling, distribution and exchange of goods and services, together with the services that facilitate them.</p>
<div class="key-points">
  <h4>Divisions of Commerce</h4>
  <ul>
    <li><strong>Trade</strong> — the buying and selling of goods (home trade and foreign trade).</li>
    <li><strong>Aids to trade</strong> — services that facilitate trade: banking, insurance, transport, warehousing, advertising, communication and tourism.</li>
  </ul>
</div>`,
            question: {
              text: "The two main divisions of commerce are",
              options: { "A": "production and consumption", "B": "trade and aids to trade", "C": "wholesale and retail", "D": "import and export" },
              correctAnswer: "B",
              explanation: "Commerce is divided into trade (buying and selling) and aids to trade (services such as banking, insurance and transport that facilitate trade)."
            }
          }
        ]
      },
      {
        name: "Commerce and Related Disciplines",
        objectives: [
          {
            title: "Relate commerce to production and other subjects",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Production</strong> creates goods; <strong>commerce</strong> distributes them to consumers.</li>
    <li>Commerce is part of the wider field of <strong>business</strong> and draws on economics, accounting and marketing.</li>
    <li>Without commerce, goods produced would not reach the consumers who need them.</li>
  </ul>
</div>`,
            question: {
              text: "Commerce is important to production mainly because it",
              options: { "A": "manufactures the goods", "B": "distributes goods from producers to consumers", "C": "provides raw materials", "D": "fixes production quotas" },
              correctAnswer: "B",
              explanation: "Commerce bridges the gap between producers and consumers by distributing and exchanging the goods that have been produced."
            }
          }
        ]
      }
    ]
  },

  "Occupations": {
    subject: "Commerce",
    topic: "Occupations",
    introduction: {
      title: "Occupations",
      description: "An occupation is the work a person does to earn a living. This topic classifies occupations and explains division of labour and specialization.",
      jambInfo: "2-3 questions on classification of occupations and division of labour."
    },
    subtopics: [
      {
        name: "Types and Classification of Occupations",
        objectives: [
          {
            title: "Classify occupations into industrial, commercial and service",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Industrial occupations</strong> — extractive (mining, farming, fishing), manufacturing and constructive.</li>
    <li><strong>Commercial occupations</strong> — trade and aids to trade (traders, bankers, insurers).</li>
    <li><strong>Service (direct) occupations</strong> — personal services (doctors, teachers, lawyers).</li>
  </ul>
</div>`,
            question: {
              text: "Fishing and mining are examples of which type of occupation?",
              options: { "A": "Commercial", "B": "Extractive (industrial)", "C": "Manufacturing", "D": "Service" },
              correctAnswer: "B",
              explanation: "Fishing and mining collect resources directly from nature, so they are extractive occupations under the industrial category."
            }
          }
        ]
      },
      {
        name: "Division of Labour and Specialization",
        objectives: [
          {
            title: "Explain division of labour and its advantages",
            explanation: `<p><strong>Division of labour</strong> is the splitting of a production process into separate tasks performed by different workers (specialization).</p>
<div class="key-points">
  <h4>Advantages</h4>
  <ul><li>Increased output, greater skill, saves time, encourages use of machinery.</li></ul>
  <h4>Disadvantages</h4>
  <ul><li>Monotony/boredom, over-dependence, risk of unemployment if one stage fails, loss of craftsmanship.</li></ul>
</div>`,
            question: {
              text: "A major disadvantage of division of labour is",
              options: { "A": "increased output", "B": "greater skill", "C": "monotony and boredom", "D": "saving of time" },
              correctAnswer: "C",
              explanation: "Repeating the same narrow task leads to monotony and boredom for the worker, which is a key disadvantage of division of labour."
            }
          }
        ]
      }
    ]
  },

  "Production": {
    subject: "Commerce",
    topic: "Production",
    introduction: {
      title: "Production",
      description: "Production is the creation of goods and services to satisfy human wants. This topic covers types and factors of production and the scale of production.",
      jambInfo: "2-3 questions on types/factors of production and economies of scale."
    },
    subtopics: [
      {
        name: "Factors and Types of Production",
        objectives: [
          {
            title: "Identify types of production and the factors of production",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Direct production</strong> — producing for one's own use.</li>
    <li><strong>Indirect production</strong> — producing for exchange/sale.</li>
  </ul>
  <h4>Factors of Production and Rewards</h4>
  <ul>
    <li>Land → rent; Labour → wages; Capital → interest; Entrepreneur → profit.</li>
  </ul>
</div>`,
            question: {
              text: "The reward for capital as a factor of production is",
              options: { "A": "rent", "B": "wages", "C": "interest", "D": "profit" },
              correctAnswer: "C",
              explanation: "Capital earns interest as its reward; land earns rent, labour earns wages, and the entrepreneur earns profit."
            }
          }
        ]
      },
      {
        name: "Scale of Production",
        objectives: [
          {
            title: "Distinguish small and large scale production and economies of scale",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Economies of scale</strong> — cost advantages a firm gains as it grows larger, so average cost falls.</li>
    <li><strong>Internal economies</strong> arise within the firm (bulk buying, specialised machinery, financial).</li>
    <li><strong>External economies</strong> arise from the growth of the whole industry (skilled labour pool, supplier networks).</li>
  </ul>
</div>`,
            question: {
              text: "Cost advantages that a firm enjoys from buying raw materials in bulk are an example of",
              options: { "A": "external economies", "B": "internal economies of scale", "C": "diseconomies of scale", "D": "diminishing returns" },
              correctAnswer: "B",
              explanation: "Bulk buying is a benefit that arises within the firm as it expands, so it is an internal economy of scale."
            }
          }
        ]
      }
    ]
  },

  "Home Trade": {
    subject: "Commerce",
    topic: "Home Trade",
    introduction: {
      title: "Home Trade",
      description: "Home (internal) trade is the buying and selling of goods within a country. This topic covers retail and wholesale trade and the channels of distribution.",
      jambInfo: "3-5 questions — a very high-yield topic, especially on functions of wholesalers/retailers and types of retailers."
    },
    subtopics: [
      {
        name: "Retail Trade",
        objectives: [
          {
            title: "Identify types of retailers and their functions",
            explanation: `<p><strong>Retailing</strong> is the sale of goods in small quantities directly to the final consumer.</p>
<div class="key-points">
  <ul>
    <li><strong>Small-scale retailers:</strong> hawkers, petty traders, kiosks, market stalls, mobile shops.</li>
    <li><strong>Large-scale retailers:</strong> supermarkets, departmental stores, chain/multiple stores, hypermarkets, mail order.</li>
  </ul>
  <h4>Functions</h4>
  <ul><li>Break bulk, offer variety, give credit, provide after-sales service, advise consumers.</li></ul>
</div>`,
            question: {
              text: "A retail outlet that has several branches selling the same range of goods is a",
              options: { "A": "departmental store", "B": "chain (multiple) store", "C": "supermarket", "D": "cooperative shop" },
              correctAnswer: "B",
              explanation: "A chain or multiple store is a group of branch shops under one ownership selling similar goods, e.g. a pharmacy chain."
            }
          }
        ]
      },
      {
        name: "Wholesale Trade and Channels of Distribution",
        objectives: [
          {
            title: "Explain the functions of the wholesaler",
            explanation: `<div class="key-points">
  <h4>Functions of the Wholesaler</h4>
  <ul>
    <li><strong>Breaking bulk</strong> — buys in large quantities and sells in smaller lots to retailers.</li>
    <li>Warehousing/storage, bearing risk, giving credit, and providing market information.</li>
    <li>Relieves the manufacturer of holding large stocks.</li>
  </ul>
  <p>Typical channel: <strong>Producer → Wholesaler → Retailer → Consumer</strong>.</p>
</div>`,
            question: {
              text: "The main function of a wholesaler is to",
              options: { "A": "sell directly to final consumers only", "B": "buy in bulk from producers and sell in smaller quantities to retailers", "C": "manufacture goods", "D": "export goods" },
              correctAnswer: "B",
              explanation: "The wholesaler breaks bulk — buying large quantities from producers and selling in smaller quantities to retailers."
            }
          }
        ]
      }
    ]
  },

  "Foreign Trade": {
    subject: "Commerce",
    topic: "Foreign Trade",
    introduction: {
      title: "Foreign Trade",
      description: "Foreign (external) trade is trade between countries. This topic covers imports, exports, entrepot trade, trade documents, and the balance of trade and payments.",
      jambInfo: "3-4 questions on foreign trade documents, balance of trade vs balance of payments."
    },
    subtopics: [
      {
        name: "Basics of Foreign Trade",
        objectives: [
          {
            title: "Distinguish import, export and entrepot trade",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Import trade</strong> — buying goods from other countries.</li>
    <li><strong>Export trade</strong> — selling goods to other countries.</li>
    <li><strong>Entrepot (re-export) trade</strong> — importing goods and re-exporting them, often after minor processing.</li>
  </ul>
</div>`,
            question: {
              text: "Goods imported into a country and then re-exported to another country describe",
              options: { "A": "import trade", "B": "export trade", "C": "entrepot trade", "D": "home trade" },
              correctAnswer: "C",
              explanation: "Entrepot (re-export) trade involves importing goods and then exporting them again to another country."
            }
          }
        ]
      },
      {
        name: "Balance of Trade, Balance of Payments and Trade Documents",
        objectives: [
          {
            title: "Identify foreign trade documents and balance concepts",
            explanation: `<div class="key-points">
  <h4>Documents</h4>
  <ul><li><strong>Bill of lading</strong> (receipt + title for goods shipped), <strong>certificate of origin</strong>, <strong>letter of credit</strong>, <strong>indent</strong>, <strong>invoice</strong>.</li></ul>
  <h4>Balances</h4>
  <ul>
    <li><strong>Balance of trade</strong> — difference between visible exports and visible imports.</li>
    <li><strong>Balance of payments</strong> — record of all transactions (visible, invisible, capital) with other countries.</li>
  </ul>
</div>`,
            question: {
              text: "The document that serves as a receipt and a document of title for goods sent by sea is the",
              options: { "A": "invoice", "B": "bill of lading", "C": "certificate of origin", "D": "indent" },
              correctAnswer: "B",
              explanation: "The bill of lading is issued by a shipping company as a receipt for goods and a document of title, allowing the holder to claim the goods."
            }
          }
        ]
      }
    ]
  },

  "Purchase and Sale of Goods": {
    subject: "Commerce",
    topic: "Purchase and Sale of Goods",
    introduction: {
      title: "Purchase and Sale of Goods",
      description: "This topic covers the procedure and documents used in buying and selling, the terms of trade, and methods of payment.",
      jambInfo: "3-4 questions, very commonly on trade documents (invoice, credit note) and discounts."
    },
    subtopics: [
      {
        name: "Procedure and Documents of Purchase and Sale",
        objectives: [
          {
            title: "Identify documents used in buying and selling",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Enquiry</strong> → <strong>Quotation</strong> → <strong>Order</strong> → <strong>Invoice</strong> → <strong>Delivery note</strong> → <strong>Statement of account</strong> → <strong>Receipt</strong>.</li>
    <li><strong>Credit note</strong> — issued when a buyer is overcharged or returns goods (reduces what he owes).</li>
    <li><strong>Debit note</strong> — issued when a buyer is undercharged (increases what he owes).</li>
    <li><strong>Pro forma invoice</strong> — a preliminary invoice sent before goods are supplied.</li>
  </ul>
</div>`,
            question: {
              text: "A document sent to a customer who has been overcharged or who returns goods is a",
              options: { "A": "debit note", "B": "credit note", "C": "invoice", "D": "receipt" },
              correctAnswer: "B",
              explanation: "A credit note is issued to reduce the amount a customer owes when they have been overcharged or have returned goods."
            }
          }
        ]
      },
      {
        name: "Terms of Trade and Payment",
        objectives: [
          {
            title: "Distinguish trade, quantity and cash discounts; terms of payment",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Trade discount</strong> — reduction given to a trader off the catalogue price (not shown in the books as discount).</li>
    <li><strong>Cash discount</strong> — reduction for prompt payment.</li>
    <li><strong>Quantity discount</strong> — for buying in large quantities.</li>
    <li><strong>Terms of payment:</strong> cash, credit, hire purchase, deferred payment.</li>
  </ul>
</div>`,
            question: {
              text: "A discount given to a customer for paying promptly within an agreed period is called",
              options: { "A": "trade discount", "B": "quantity discount", "C": "cash discount", "D": "seasonal discount" },
              correctAnswer: "C",
              explanation: "A cash discount is a reduction in price offered to encourage a customer to pay promptly within a stated period."
            }
          }
        ]
      }
    ]
  },

  "Aids to Trade": {
    subject: "Commerce",
    topic: "Aids to Trade",
    introduction: {
      title: "Aids to Trade",
      description: "Aids to trade are services that facilitate the exchange of goods. This topic covers advertising and communication, banking and insurance, and transportation, warehousing and tourism.",
      jambInfo: "4-6 questions — one of the biggest topics, especially insurance principles and transport."
    },
    subtopics: [
      {
        name: "Advertising and Communication",
        objectives: [
          {
            title: "Explain advertising, its types and media",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Informative advertising</strong> gives facts about a product; <strong>persuasive advertising</strong> urges purchase.</li>
    <li><strong>Media:</strong> radio, television, newspapers, magazines, billboards, internet/social media.</li>
    <li>Advertising increases sales and awareness but adds to costs and can mislead.</li>
  </ul>
</div>`,
            question: {
              text: "Advertising that merely gives facts about a product without urging purchase is",
              options: { "A": "persuasive advertising", "B": "informative advertising", "C": "competitive advertising", "D": "comparative advertising" },
              correctAnswer: "B",
              explanation: "Informative advertising simply provides information/facts about a product, while persuasive advertising tries to convince consumers to buy."
            }
          }
        ]
      },
      {
        name: "Banking and Insurance",
        objectives: [
          {
            title: "Explain the principles of insurance",
            explanation: `<div class="key-points">
  <h4>Principles of Insurance</h4>
  <ul>
    <li><strong>Utmost good faith</strong> — full and honest disclosure of material facts.</li>
    <li><strong>Insurable interest</strong> — the insured must stand to lose if the event occurs.</li>
    <li><strong>Indemnity</strong> — the insured is restored to their former position, not to make a profit.</li>
    <li><strong>Subrogation</strong> and <strong>contribution</strong> — support the indemnity principle.</li>
    <li><strong>Proximate cause</strong> — the loss must be directly caused by the insured risk.</li>
  </ul>
</div>
<div class="warning-box"><h4>Assurance vs Insurance</h4><p><strong>Assurance</strong> covers an event that will certainly happen (e.g. death — life assurance); <strong>insurance</strong> covers an event that may happen (e.g. fire).</p></div>`,
            question: {
              text: "The insurance principle which ensures that the insured does not make a profit from a claim is",
              options: { "A": "utmost good faith", "B": "insurable interest", "C": "indemnity", "D": "proximate cause" },
              correctAnswer: "C",
              explanation: "The principle of indemnity ensures the insured is only restored to their former financial position and does not gain a profit from a loss."
            }
          }
        ]
      },
      {
        name: "Transportation, Warehousing and Tourism",
        objectives: [
          {
            title: "Explain warehousing and modes of transport",
            explanation: `<div class="key-points">
  <h4>Warehousing</h4>
  <ul><li>Storage of goods until they are needed; creates <strong>time utility</strong>, stabilises prices and holds stock for seasonal goods.</li></ul>
  <h4>Transport</h4>
  <ul><li>Road (flexible), rail (bulky goods overland), water (cheap, heavy long-distance), air (fast, costly), pipeline (oil/gas). Transport creates <strong>place utility</strong>.</li></ul>
</div>`,
            question: {
              text: "The economic function performed by warehousing is the creation of",
              options: { "A": "place utility", "B": "form utility", "C": "time utility", "D": "possession utility" },
              correctAnswer: "C",
              explanation: "Warehousing stores goods until they are demanded, creating time utility by making goods available at the right time."
            }
          }
        ]
      }
    ]
  },

  "Business Units": {
    subject: "Commerce",
    topic: "Business Units",
    introduction: {
      title: "Business Units",
      description: "Business units are the different legal forms a business can take. This topic covers sole proprietorship, partnership, limited liability companies, cooperatives and public enterprises.",
      jambInfo: "4-5 questions — a very high-yield topic, especially on company formation and features of each unit."
    },
    subtopics: [
      {
        name: "Sole Proprietorship and Partnership",
        objectives: [
          {
            title: "Describe sole proprietorship and partnership",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Sole proprietorship</strong> — one owner; easy to form; unlimited liability; owner takes all profit and risk.</li>
    <li><strong>Partnership</strong> — 2–20 persons; formed by a <strong>partnership deed</strong>; shared capital, profit and (usually unlimited) liability.</li>
    <li>Types of partners: active, sleeping (dormant), limited, nominal.</li>
  </ul>
</div>`,
            question: {
              text: "The maximum number of persons allowed in an ordinary partnership is",
              options: { "A": "10", "B": "20", "C": "50", "D": "unlimited" },
              correctAnswer: "B",
              explanation: "An ordinary partnership consists of between 2 and 20 persons (banks were historically limited to 10)."
            }
          }
        ]
      },
      {
        name: "Limited Liability Companies",
        objectives: [
          {
            title: "Distinguish private and public companies and formation documents",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Private company (Ltd)</strong> — 2–50 members, cannot invite the public to buy shares, shares not freely transferable.</li>
    <li><strong>Public company (Plc)</strong> — minimum 7 members, no maximum, can sell shares to the public.</li>
  </ul>
  <h4>Formation Documents</h4>
  <ul><li><strong>Memorandum of Association</strong> (external relations), <strong>Articles of Association</strong> (internal rules), <strong>Prospectus</strong>, leading to the <strong>Certificate of Incorporation</strong>.</li></ul>
</div>`,
            question: {
              text: "The document that governs the internal management and rules of a company is the",
              options: { "A": "memorandum of association", "B": "articles of association", "C": "prospectus", "D": "certificate of incorporation" },
              correctAnswer: "B",
              explanation: "The Articles of Association set out the internal rules and regulations governing how the company is run, while the Memorandum governs its external relations."
            }
          }
        ]
      },
      {
        name: "Cooperative Societies and Public Enterprises",
        objectives: [
          {
            title: "Describe cooperatives and public corporations",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Cooperative society</strong> — a voluntary association of people who pool resources for mutual benefit; profits shared as dividends by patronage; "one member, one vote".</li>
    <li><strong>Public corporation</strong> — a business owned and run by government to provide essential services (e.g. NNPC); financed by government, not profit-driven.</li>
    <li><strong>Privatization</strong> transfers public enterprises to private ownership.</li>
  </ul>
</div>`,
            question: {
              text: "A distinctive feature of a cooperative society is that",
              options: { "A": "one share carries one vote", "B": "each member has one vote regardless of shares", "C": "only the rich can join", "D": "it is owned by the government" },
              correctAnswer: "B",
              explanation: "Cooperatives operate on the democratic principle of 'one member, one vote', regardless of how many shares each member holds."
            }
          }
        ]
      }
    ]
  },

  "Financing Business": {
    subject: "Commerce",
    topic: "Financing Business",
    introduction: {
      title: "Financing Business",
      description: "Businesses need finance to start and grow. This topic covers the sources of business finance and the securities used to raise capital.",
      jambInfo: "2-3 questions on sources of finance and types of shares/debentures."
    },
    subtopics: [
      {
        name: "Sources of Business Finance",
        objectives: [
          {
            title: "Identify short, medium and long-term sources of finance",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Short-term:</strong> bank overdraft, trade credit, short loans.</li>
    <li><strong>Medium-term:</strong> hire purchase, leasing, medium bank loans.</li>
    <li><strong>Long-term:</strong> owner's capital, shares, debentures, long-term loans, ploughed-back profit.</li>
  </ul>
</div>`,
            question: {
              text: "Which of the following is a short-term source of business finance?",
              options: { "A": "Issue of shares", "B": "Bank overdraft", "C": "Debentures", "D": "Ploughed-back profit" },
              correctAnswer: "B",
              explanation: "A bank overdraft is a short-term source of finance repayable on demand or within a short period; shares and debentures are long-term."
            }
          }
        ]
      },
      {
        name: "Business Securities",
        objectives: [
          {
            title: "Distinguish shares from debentures",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Ordinary shares</strong> — carry voting rights; dividends vary with profit; owners bear the most risk.</li>
    <li><strong>Preference shares</strong> — fixed dividend, paid before ordinary shares, usually no voting rights.</li>
    <li><strong>Debentures</strong> — loans to the company at fixed interest; debenture holders are <em>creditors</em>, not owners, and are paid before shareholders.</li>
  </ul>
</div>`,
            question: {
              text: "A holder of a debenture in a company is a",
              options: { "A": "part-owner of the company", "B": "creditor of the company", "C": "director of the company", "D": "customer of the company" },
              correctAnswer: "B",
              explanation: "A debenture is a loan to the company, so the debenture holder is a creditor (lender), not an owner like a shareholder."
            }
          }
        ]
      }
    ]
  },

  "Trade Associations and Chambers of Commerce": {
    subject: "Commerce",
    topic: "Trade Associations and Chambers of Commerce",
    introduction: {
      title: "Trade Associations and Chambers of Commerce",
      description: "Businesses form associations to protect and promote their common interests. This topic covers trade associations and chambers of commerce.",
      jambInfo: "1-2 questions on the functions of these bodies."
    },
    subtopics: [
      {
        name: "Trade and Manufacturer Associations",
        objectives: [
          {
            title: "State the functions of trade associations",
            explanation: `<div class="key-points">
  <ul>
    <li>A <strong>trade association</strong> is a body of firms in the same line of business that promotes their common interests.</li>
    <li>Functions: represent members to government, set standards, share information, settle disputes, and lobby on policy.</li>
    <li>Example: the Manufacturers Association of Nigeria (MAN).</li>
  </ul>
</div>`,
            question: {
              text: "The main purpose of a trade association is to",
              options: { "A": "make profit for the government", "B": "protect and promote the common interests of its members", "C": "manufacture goods", "D": "collect taxes" },
              correctAnswer: "B",
              explanation: "A trade association exists to protect and promote the shared interests of firms in the same trade, such as lobbying government and setting standards."
            }
          }
        ]
      },
      {
        name: "Chambers of Commerce",
        objectives: [
          {
            title: "Describe the functions of chambers of commerce",
            explanation: `<div class="key-points">
  <ul>
    <li>A <strong>chamber of commerce</strong> is an association of business people from different trades in a locality or country.</li>
    <li>Functions: promote trade, advise government on commercial policy, organise trade fairs, provide information, and settle trade disputes.</li>
    <li>Example: NACCIMA (Nigerian Association of Chambers of Commerce, Industry, Mines and Agriculture).</li>
  </ul>
</div>`,
            question: {
              text: "Which body brings together business people from different trades to promote commerce in a country?",
              options: { "A": "Trade union", "B": "Chamber of commerce", "C": "Cooperative society", "D": "Stock exchange" },
              correctAnswer: "B",
              explanation: "A chamber of commerce is an association of business people from various trades that promotes and protects commercial interests and advises government."
            }
          }
        ]
      }
    ]
  },

  "Money": {
    subject: "Commerce",
    topic: "Money",
    introduction: {
      title: "Money",
      description: "Money is anything generally accepted as a means of payment. This topic covers the evolution, characteristics and functions of money, and its value and inflation.",
      jambInfo: "2-3 questions on functions and characteristics of money."
    },
    subtopics: [
      {
        name: "Evolution, Characteristics and Functions of Money",
        objectives: [
          {
            title: "State the characteristics and functions of money",
            explanation: `<div class="key-points">
  <h4>Functions of Money</h4>
  <ul><li>Medium of exchange, measure of value, store of value, standard of deferred payment.</li></ul>
  <h4>Characteristics</h4>
  <ul><li>Acceptability, durability, portability, divisibility, homogeneity, relative scarcity.</li></ul>
  <p>Money replaced <strong>trade by barter</strong>, which suffered from the problem of the double coincidence of wants.</p>
</div>`,
            question: {
              text: "The main problem of trade by barter that money solved is the",
              options: { "A": "lack of durability", "B": "double coincidence of wants", "C": "shortage of goods", "D": "high cost of goods" },
              correctAnswer: "B",
              explanation: "Barter required a double coincidence of wants — each party wanting what the other offered. Money removed this problem by acting as a medium of exchange."
            }
          }
        ]
      },
      {
        name: "Value of Money and Inflation",
        objectives: [
          {
            title: "Explain the value of money and inflation",
            explanation: `<div class="key-points">
  <ul>
    <li>The <strong>value of money</strong> is its purchasing power — what it can buy.</li>
    <li><strong>Inflation</strong> (a persistent rise in prices) reduces the value of money; <strong>deflation</strong> raises it.</li>
  </ul>
</div>`,
            question: {
              text: "During inflation, the value (purchasing power) of money",
              options: { "A": "rises", "B": "falls", "C": "remains constant", "D": "becomes zero" },
              correctAnswer: "B",
              explanation: "Inflation means prices rise, so a unit of money buys fewer goods — the purchasing power (value) of money falls."
            }
          }
        ]
      }
    ]
  },

  "Stock Exchange": {
    subject: "Commerce",
    topic: "Stock Exchange",
    introduction: {
      title: "Stock Exchange",
      description: "The stock exchange is a market for buying and selling existing shares and stocks. This topic covers its operations, operators and the securities traded.",
      jambInfo: "2-3 questions on the functions of the stock exchange and its operators."
    },
    subtopics: [
      {
        name: "Operations of the Stock Exchange",
        objectives: [
          {
            title: "Describe the stock exchange and its operators",
            explanation: `<div class="key-points">
  <ul>
    <li>The <strong>stock exchange</strong> is a market for second-hand (existing) long-term securities such as shares and bonds.</li>
    <li><strong>Stockbroker</strong> — buys and sells on behalf of clients for a commission.</li>
    <li><strong>Jobber/dealer</strong> — deals in securities on their own account.</li>
    <li><strong>Bull</strong> — expects prices to rise; <strong>Bear</strong> — expects prices to fall; <strong>Stag</strong> — buys new issues hoping to sell at a premium.</li>
  </ul>
</div>`,
            question: {
              text: "On the stock exchange, a speculator who buys shares expecting prices to rise is a",
              options: { "A": "bear", "B": "bull", "C": "stag", "D": "jobber" },
              correctAnswer: "B",
              explanation: "A bull is a speculator who buys securities in expectation that their prices will rise so as to sell later at a profit."
            }
          }
        ]
      },
      {
        name: "Securities and the Second-Tier Securities Market",
        objectives: [
          {
            title: "Explain functions and the second-tier securities market",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Functions of the stock exchange:</strong> provides a ready market for securities, mobilises savings for investment, values securities, and encourages capital formation.</li>
    <li>The <strong>Second-Tier Securities Market (SSM)</strong> has less stringent listing requirements, allowing small and medium companies to raise capital.</li>
  </ul>
</div>`,
            question: {
              text: "The Second-Tier Securities Market was established mainly to",
              options: { "A": "trade foreign currencies", "B": "enable small and medium companies to raise capital with easier requirements", "C": "sell treasury bills", "D": "control inflation" },
              correctAnswer: "B",
              explanation: "The Second-Tier Securities Market has relaxed listing requirements so that small and medium-sized companies can access the capital market."
            }
          }
        ]
      }
    ]
  },

  "Elements of Business Management": {
    subject: "Commerce",
    topic: "Elements of Business Management",
    introduction: {
      title: "Elements of Business Management",
      description: "Management coordinates resources to achieve business goals. This topic covers the functions and principles of management and organizational structure.",
      jambInfo: "2-3 questions on the functions and principles of management."
    },
    subtopics: [
      {
        name: "Functions and Principles of Management",
        objectives: [
          {
            title: "Identify the functions of management",
            explanation: `<div class="key-points">
  <h4>Functions of Management</h4>
  <ul><li><strong>P</strong>lanning, <strong>O</strong>rganizing, <strong>S</strong>taffing, <strong>D</strong>irecting, <strong>C</strong>oordinating and <strong>C</strong>ontrolling.</li></ul>
  <h4>Key Principles</h4>
  <ul><li><strong>Span of control</strong> (number a manager can supervise), <strong>unity of command</strong> (one boss per worker), <strong>delegation</strong> of authority.</li></ul>
</div>`,
            question: {
              text: "The management principle stating that a subordinate should receive orders from only one superior is",
              options: { "A": "span of control", "B": "unity of command", "C": "delegation", "D": "division of labour" },
              correctAnswer: "B",
              explanation: "Unity of command means each employee should take orders from, and be responsible to, only one superior to avoid confusion."
            }
          }
        ]
      },
      {
        name: "Organizational Structure and Business Resources",
        objectives: [
          {
            title: "Describe organizational structures and business resources",
            explanation: `<div class="key-points">
  <ul>
    <li>Organizational structures: <strong>line</strong>, <strong>line-and-staff</strong>, <strong>functional</strong>, <strong>matrix</strong>.</li>
    <li>Business resources — the "4 Ms": <strong>Men</strong> (labour), <strong>Money</strong> (capital), <strong>Materials</strong>, <strong>Machines</strong>.</li>
  </ul>
</div>`,
            question: {
              text: "The four basic resources of a business are often summarised as",
              options: { "A": "men, money, materials and machines", "B": "land, labour, capital and profit", "C": "buying, selling, storing and transporting", "D": "planning, organizing, staffing and control" },
              correctAnswer: "A",
              explanation: "The basic business resources are commonly called the '4 Ms': men, money, materials and machines."
            }
          }
        ]
      }
    ]
  },

  "Elements of Marketing": {
    subject: "Commerce",
    topic: "Elements of Marketing",
    introduction: {
      title: "Elements of Marketing",
      description: "Marketing is the process of identifying and satisfying customer needs profitably. This topic covers marketing functions, the marketing mix and marketing research.",
      jambInfo: "2-3 questions, especially on the elements of the marketing mix (the 4 Ps)."
    },
    subtopics: [
      {
        name: "Marketing Concepts and Functions",
        objectives: [
          {
            title: "Define marketing and market segmentation",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Marketing</strong> is the set of activities that identify, anticipate and satisfy customer needs profitably.</li>
    <li><strong>Market segmentation</strong> is dividing a market into groups of buyers with similar needs (by age, income, location, etc.).</li>
  </ul>
</div>`,
            question: {
              text: "Dividing a total market into groups of customers with similar characteristics is called",
              options: { "A": "the marketing mix", "B": "market segmentation", "C": "branding", "D": "advertising" },
              correctAnswer: "B",
              explanation: "Market segmentation divides a market into distinct groups of buyers who share similar needs or characteristics so they can be served more effectively."
            }
          }
        ]
      },
      {
        name: "The Marketing Mix and Marketing Research",
        objectives: [
          {
            title: "Explain the elements of the marketing mix",
            explanation: `<div class="key-points">
  <h4>The Marketing Mix (4 Ps)</h4>
  <ul>
    <li><strong>Product</strong> — the good or service and its features, branding and packaging.</li>
    <li><strong>Price</strong> — the amount charged.</li>
    <li><strong>Place</strong> — how and where the product reaches customers (distribution).</li>
    <li><strong>Promotion</strong> — advertising, sales promotion, personal selling.</li>
  </ul>
</div>`,
            question: {
              text: "Which of the following is NOT part of the marketing mix (4 Ps)?",
              options: { "A": "Product", "B": "Price", "C": "Production", "D": "Promotion" },
              correctAnswer: "C",
              explanation: "The 4 Ps of the marketing mix are Product, Price, Place and Promotion. Production is not one of them."
            }
          }
        ]
      }
    ]
  },

  "Legal Aspects of Business": {
    subject: "Commerce",
    topic: "Legal Aspects of Business",
    introduction: {
      title: "Legal Aspects of Business",
      description: "Business transactions are governed by law. This topic covers contracts, the sale of goods, agency, hire purchase and consumer protection.",
      jambInfo: "2-4 questions, commonly on the elements of a valid contract and consumer protection bodies."
    },
    subtopics: [
      {
        name: "Contract and Sale of Goods",
        objectives: [
          {
            title: "Identify the elements of a valid contract",
            explanation: `<div class="key-points">
  <h4>Essentials of a Valid Contract</h4>
  <ul>
    <li><strong>Offer</strong> and <strong>acceptance</strong>.</li>
    <li><strong>Consideration</strong> (something of value exchanged).</li>
    <li><strong>Intention</strong> to create legal relations.</li>
    <li><strong>Capacity</strong> to contract.</li>
    <li><strong>Free consent</strong> and a <strong>lawful object</strong>.</li>
  </ul>
</div>
<div class="warning-box"><h4>Caveat Emptor</h4><p>"Let the buyer beware" — buyers should examine goods before purchase, as the seller is not always liable for defects.</p></div>`,
            question: {
              text: "Which of the following is essential for a valid contract?",
              options: { "A": "A written document only", "B": "Offer and acceptance", "C": "The presence of a lawyer", "D": "Payment in cash" },
              correctAnswer: "B",
              explanation: "A valid contract requires a lawful offer and its acceptance, plus consideration, capacity, intention and free consent. It need not be written or witnessed by a lawyer."
            }
          }
        ]
      },
      {
        name: "Agency, Hire Purchase and Consumer Protection",
        objectives: [
          {
            title: "Explain agency, hire purchase and consumer protection",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Agency</strong> — a relationship where an agent acts on behalf of a principal.</li>
    <li><strong>Hire purchase</strong> — the buyer pays by instalments and only owns the goods after the final payment.</li>
    <li><strong>Consumer protection bodies:</strong> SON (standards), NAFDAC (food and drugs), FCCPC/CPC (competition and consumer protection).</li>
  </ul>
</div>`,
            question: {
              text: "Under a hire purchase agreement, ownership of the goods passes to the buyer",
              options: { "A": "immediately the agreement is signed", "B": "after paying the first instalment", "C": "only after the final instalment is paid", "D": "when the goods are delivered" },
              correctAnswer: "C",
              explanation: "In hire purchase the buyer only becomes the owner after paying the last instalment; until then the goods belong to the seller."
            }
          }
        ]
      }
    ]
  },

  "Information and Communication Technology in Commerce": {
    subject: "Commerce",
    topic: "Information and Communication Technology in Commerce",
    introduction: {
      title: "Information and Communication Technology in Commerce",
      description: "ICT has transformed how business is done. This topic covers ICT tools in business and the growth of e-commerce and e-banking.",
      jambInfo: "2-3 questions on ICT tools and e-commerce/e-banking."
    },
    subtopics: [
      {
        name: "ICT Tools and Applications in Business",
        objectives: [
          {
            title: "Identify ICT tools used in commerce",
            explanation: `<div class="key-points">
  <ul>
    <li>Tools: computers, the internet, mobile phones, <strong>POS terminals</strong>, <strong>ATMs</strong>, and payment platforms.</li>
    <li>Uses: online marketing, electronic payment, record keeping, communication and inventory management.</li>
    <li>Benefits: speed, wider reach, lower cost; challenges: fraud, poor power/network, and cost of equipment.</li>
  </ul>
</div>`,
            question: {
              text: "The machine that allows bank customers to withdraw cash without a cashier is the",
              options: { "A": "POS terminal", "B": "ATM", "C": "printer", "D": "modem" },
              correctAnswer: "B",
              explanation: "The Automated Teller Machine (ATM) dispenses cash and provides other banking services electronically without a human cashier."
            }
          }
        ]
      },
      {
        name: "E-Commerce and E-Banking",
        objectives: [
          {
            title: "Define e-commerce and its types",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>E-commerce</strong> — buying and selling of goods and services over the internet.</li>
    <li>Types: <strong>B2B</strong> (business to business), <strong>B2C</strong> (business to consumer), <strong>C2C</strong> (consumer to consumer).</li>
    <li><strong>E-banking</strong> — carrying out banking transactions electronically (mobile/internet banking, transfers).</li>
  </ul>
</div>`,
            question: {
              text: "An online transaction between a company and a final consumer is an example of",
              options: { "A": "B2B e-commerce", "B": "B2C e-commerce", "C": "C2C e-commerce", "D": "barter" },
              correctAnswer: "B",
              explanation: "Business-to-consumer (B2C) e-commerce is a transaction between a business and the final consumer, such as buying from an online store."
            }
          }
        ]
      }
    ]
  },

  "Business Environment and Social Responsibility": {
    subject: "Commerce",
    topic: "Business Environment and Social Responsibility",
    introduction: {
      title: "Business Environment and Social Responsibility",
      description: "Businesses operate within an environment and owe duties to society. This topic covers the elements of the business environment and the social responsibility of business.",
      jambInfo: "1-2 questions on the business environment and social responsibility."
    },
    subtopics: [
      {
        name: "The Business Environment",
        objectives: [
          {
            title: "Identify the elements of the business environment",
            explanation: `<div class="key-points">
  <ul>
    <li>The business environment includes <strong>economic</strong>, <strong>political/legal</strong>, <strong>social/cultural</strong> and <strong>technological</strong> factors.</li>
    <li>These external factors affect a firm's decisions but are largely outside its control.</li>
  </ul>
</div>`,
            question: {
              text: "Government policies and laws that affect a business form part of its ______ environment.",
              options: { "A": "social", "B": "political/legal", "C": "technological", "D": "natural" },
              correctAnswer: "B",
              explanation: "Government policies, laws and regulations make up the political/legal component of the business environment."
            }
          }
        ]
      },
      {
        name: "Social Responsibility of Business",
        objectives: [
          {
            title: "Explain the social responsibility of business",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Social responsibility</strong> is the duty of a business to act in ways that benefit society, not just its owners.</li>
    <li>Responsibilities: to customers (safe products, fair prices), employees (fair wages, safety), the community (environmental care, amenities) and government (paying taxes).</li>
  </ul>
</div>`,
            question: {
              text: "A business shows social responsibility to the community when it",
              options: { "A": "evades taxes", "B": "pollutes the environment", "C": "protects the environment and provides amenities", "D": "sells substandard goods" },
              correctAnswer: "C",
              explanation: "Social responsibility to the community includes protecting the environment and providing amenities, rather than harming society for profit."
            }
          }
        ]
      }
    ]
  }

};

window.COMMERCE_LEARNING_CONTENT = COMMERCE_LEARNING_CONTENT;
