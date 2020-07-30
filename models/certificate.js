let mongoose = require('mongoose');

// certificates Schema
let certSchema = mongoose.Schema({
    assetID:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset'
    },

    water_section:{
        type: String,
        enum:[
          'Risk Assessment for Cryptosporidium',
          'Filters Evaluation Operation Maintenance',
          'Water Treatment - Dealing with Problems',
          'Drinking Water Regulations',
          'Drinking Water Incident Management Training',
          'Sustainable Urban Drainage System Training (SUDS)',
          'EPANET training',
          'Pumps Operation and Maintenance',
          'Water Clarification Process/THM Removal',
          'Drinking Water Regulations EPA Handbook',
          'Fluoridation of Water Supplies',
          'WasteWater Treatment - Plant Operators Assessment Course including Practical assessment',
          'Water Treatment - Plant Operators Assessment Course including Practical assessment',
          'Distribution System Operations and Maintenance',
          'Water Treatment & Distribution - Appreciation',
          'Fats Oil and Grease',
          'Quality Assurance Water Treatment Plants',
          'Quality Assurance Wastewater Treatment Plants',
          'Chlorine Handling',
          'DWNMP Sampling Procedures',
          'Membrane Technology in Water / Wastewater Plants',
          'Operation and Maintenance of Small Wastewater Plants',
          'Safety for Water/Wastewater Workers',
          'Sludge Handling',
          'Taste and Odour Issues in Water Treatment',
          'Troubleshooting the Activated Sludge Process',
          'Water Conservation -Network Management - Leakage Control - Operatives',
          'Water Conservation - Network Management Leakage Control - Managers',
          'Pipeline Corrosion/Lead Services',
          'Confined Spaces - High Risk',
          'Confined Spaces - Low Risk',
          'Confined Spaces - Medium Risk',
          'Confined Spaces - Management of Risk',
          'Confined Spaces - Emergency & Rescue',
          'Distribution System - Unidirectional Flushing',
          'Water Metering and Installation',
          'Hygiene in Water Services',
          'Inspection of Domestic Waste Water Treatment Systems',
          'Management and Operation of Waste Water Overflows',
          'Nutrient Removal in Wastewater Treatment Plants',
          'Control Septicity in Rising Mains & Wastewater networks',
          'Electrofusion'
        ]

    },

    roads_section:{ type:String, 
            enum:[
                'CSCS - Mini Digger New Entrant Programme',
                'CSCS - Health & Safety at Roadworks',
                'CSCS - Tractor Dozer New Entrant Programme',
                'CSCS - Locating Underground Services',
                'Trench Support',
                'Driver CPC Module 1 (CVEDT)',
                'Driver CPC Module 2 (MRMET)',
                'Driver CPC Module 3 (HSOPD)',
                'Driver CPC Module 4 (RPDTI)',
                'Driver CPC Module 5 (PROTD)',
                'Driver CPC Module 6 (PROBD)',
                'Manual Handling Outdoor ',
                'CSCS - 360 Degree Excavator New Entrant Programme',
                'IOSH - Managing Safely for Construction Managers ',
                'Ride on Mower',
                'Operation & Maintenance of Lawnmowers',
                'CSCS - Slinger Signaller New Entrant Programme',
                'CSCS - Signing Lighting & Guarding at Roadworks',
                'Operation and Maintenance of Strimmers & Bushcutters',
                'Safe Systems of Work Plans Training',
                'CSCS - 180 Degree Excavator New Entrant Programme',
                'CSCS - Site Dumper New Entrant Programme',
                'CSCS - 180 Degree Excavator Experienced Operator Programme / Assessment',
                'Safe Pass',
                'Basic Road Strengthening',
                'Chainsaw Training For Local Authority Operatives - Refresher',
                'Masonry Arch Repair',
                'CSCS - 360 Degree Excavator Experienced Operator Programme / Assessment',
                'CSCS - Mini Digger Experienced Operator Programme / Assessment',
                'CSCS - Mini Digger New Entrant Programme',
                'CSCS - Health & Safety at Roadworks',
                'CSCS - Tractor Dozer New Entrant Programme',
                'CSCS - Locating Underground Services',
                'Trench Support',
                'Driver CPC Module 1 (CVEDT)',
                'Driver CPC Module 2 (MRMET)',
                'Driver CPC Module 3 (HSOPD)',
                'Driver CPC Module 4 (RPDTI)',
                'Driver CPC Module 5 (PROTD)',
                'Driver CPC Module 6 (PROBD)',
                'Manual Handling Outdoor ',
                'CSCS - 360 Degree Excavator New Entrant Programme',
                'IOSH - Managing Safely for Construction Managers ',
                'Ride on Mower',
                'Operation & Maintenance of Lawnmowers',
                'CSCS - Slinger Signaller New Entrant Programme',
                'CSCS - Signing Lighting & Guarding at Roadworks',
                'Operation and Maintenance of Strimmers & Bushcutters',
                'Safe Systems of Work Plans Training',
                'CSCS - 180 Degree Excavator New Entrant Programme',
                'CSCS - Site Dumper New Entrant Programme',
                'CSCS - 180 Degree Excavator Experienced Operator Programme / Assessment',
                'Safe Pass',
                'Basic Road Strengthening',
                'Chainsaw Training For Local Authority Operatives - Refresher',
                'Masonry Arch Repair',
                'CSCS - 360 Degree Excavator Experienced Operator Programme / Assessment',
                'CSCS - Mini Digger Experienced Operator Programme / Assessment',
                'Driving Licence Category C',
                'Driving Licence Category W',
                'Driving Licence Category C1',
                'Driving Licence Category CE',
                'Driving Licence Category C1E',
                'Driving Licence Category BE',
                'Safe use of Pesticides & Herbicides - CG',
                'Safe use of Pesticides & Herbicides - Handheld - CG',
                'Safe use of Pesticides & Herbicides - Professional users',
                'Road Services Supervisor',
                'Road Opening and Reinstatement - Basic',
                'Road Opening and Reinstatement - Advanced',
                'First Aid Response',
                'First Aid Response - Refresher',
                'Chainsaw Training for New Local Authority Operatives - City & Guilds',
                'Surface Dressing for Operatives',
                'Surface Dressing For Engineers',
                'Surface Dressing - Series 900 Design & Contracts',
                'Winter Service Operator - Refresher',
                'CSCS - Site Dumper Experienced Operator Programme / Assessment',
                'Location of Underground Services - Refresher',
                'Mini Digger - Refresher',
                'Site Dumper - Refresher',
                'Slinger Signaller - Refresher',
                'Telescopic Handler - Refresher',
                'Operation and Maintenance of Lawnmowers, Strimmers, Hedge Trimmers and Leaf Blowers',
                'School Warden Training',
                'Safe Loading and Cargo Securing',
                'Temporary Traffic Management - Inspection and Audit',
                'Temporary Traffic Management - Level 3 Roads Supervisor',
                'Temporary Traffic Management on Level 3 Roads: IPV Operative',
                'Temporary Traffic Management on Level 3 Roads: Mobile Operative',
                'Temporary Traffic Management on Level 3 Roads: Static Operative',
                'Temporary Traffic Management Planning & Design - Level 1 and 2 Roads',
                'Temporary Traffic Management Planning & Design - Level 3 Roads',
                'Winter Service Management',
                'Pavement Condition Index Visual Surveyor - Rural and Urban Flexible',

            ]
    },

    environment_section:{
          type:String,
          enum:[
            'Small Stream Risk Scoring',
            'Hazardous Chemical and Spillage Control',
            'Waste Management',
            'Environmental Legislation',
            'Environmental Inspection Skills ',
            'Management of Hazardous Waste in Waste Facilities',
            'Derelict Sites and Dangerous Structures',
            'Site Suitability Assessment for On-Site Waste Water Treatment Systems',
            'Litter Warden Training',
            'Agricultural Pollution Investigation & Inspection',
            'Solid Fuel Regulations',
            'Enforcement of Waste Management Packaging Regulations',
            'Fly Tipped Waste - Safety for Operatives',
            'Courtroom Skills',
            'Management of Invasive Plants and Biosecurity',
            'Aggressive Behaviour - Environmental',
            'Litter Warden Training',
            'Agricultural Pollution Investigation & Inspection',
            'Solid Fuel Regulations',
            'Enforcement of Waste Management Packaging Regulations',
            'Fly Tipped Waste - Safety for Operatives',
            'Courtroom Skills',
            'Management of Invasive Plants and Biosecurity',
            'Aggressive Behaviour - Environmental',
            'Open Source Internet Investigations',
            'Waste Enforcement - Investigation and Prosecution'
          ]
    },
    equipment_certification:{
        type:String,
        enum:[
        'Lifting Certificate (GA1)',
        'Vehicle Checks',
        'CVRT',
        'Office Equipment PC’s/Printers etc…',
        'Power Tools'
    ]
    },
    construction_section:{
        type:String,
        enum:[
            'Site Safety Induction',
            'Safety Management for Supervisors',
            'Safe Pass Training',
            'Risk Assessment & SPA',
            'Chemical Handling Training',
            'Manual Handling',
            'Occupational First Aid',
            'MEWP Training',
            'Boom Hoist Training',
            'Water Safety Course',
            'Fire Extinguisher',
            'Abrasive Wheels',
            'Confined Space Entry / Breathing Apparatus',
            'Confined Space Awareness',
            'Work At Height / Safety Harness',
            'Forklift Driver Training',
            'Side Loader Driver Training',
            'Motorised Pallet Truck Training',
            'Safety Rep.',
            'CSCS 180° Excavator',
            'CSCS Telescopic Handler',
            'CSCS Tractor/Dozer',
            'CSCS Mobile Crane',
            'CSCS 360° Excavator',
            'CSCS Slinger/Signaller',
            'CSCS Articulated Dumper',
            'CSCS Crawler Crane',
            'CSCS Mini Excavator',
            'CSCS Self Erect Tower Crane',
            'CSCS Site Dumper',
            'CSCS Tower Crane',
            'CSCS Roof and Wall Sheeting/Cladding',
            'CSCS Built-Up Roof Felting - Bituminous',
            'CSCS Built-Up Roof Felting  - Single Ply Roofing Systems',
            'CSCS Scaffolding Basic',
            'CSCS Scaffolding Advanced',
            'CSCS Mobile Tower Scaffold',
            'CSCS Locating Underground Services',
            'CSCS Signing, Lighting & Guarding at Roadwork',
            'CSCS Health and Safety Roadworks',
            'CSCS Shot Firing'

        ]
    },

    quarying_section:{
        type:String,
        enum:[
            'Workplace Induction',
            'Safe Pass',
            'Quarry Pass',
            'Manual Handling',
            'Abrasive Wheels',
            'Occupational First Aid',
            'QSCS 180° Excavator',
            'QSCS Telescopic Handler',
            'QSCS Tractor/Dozer',
            'QSCS Front End Loader',
            'QSCS 360° Excavator',
            'QSCS Slinger/Signaller',
            'QSCS Articulated Dumper',
            'QSCS Crawler Crane',
            'QSCS Mini Excavator',
            'QSCS Rigid Dump Truck',
            'QSCS Site Dumper',
            'QSCS Tower Crane',
            'QSCS Shotfiring ',
            'QSCS Explosives Supervision'   
        ]
    },

    administration_section:{
        type:String,
        enum:['Administration']
    },

    agricultural_section:{
        type:String,
        enum:['Agricultural Services & Products']
    },

    automotive_section:{
        type:String,
        enum:['Automotive']
    },

    fishing_section:{
        type:String,
        enum:['Fishing']
    },

    oil_and_gas_section:{
        type:String,
        enum:['Oil & Gas']
    },

    pharmaceutical_section:{
        type:String,
        enum:['Pharmaceutical']
    },

    retail_and_hospitality:{
        type:String,
        enum:[
            'Manual Handling',
            'Handling Payments',
            'Food Safety In Catering/Food Safety in Catering',
            'Food And Beverage Service',
            'Beverage Product Knowledge',
            'HASAP',
            'Customer Service In The Hospitality And Catering Industry',
            'Safety At Work',
            'Hot Beverage Product Knowledge',
            'Menu Knowledge And Design'
        ]
    },

    haulage_transportation:{
        type:String,
        enum:[
            'Safe Pass',
            'Manual Handling',
            'Forklift Driver Training',
            'Side Loader Driver Training',
            'Motorised Pallet Truck Training',
            'Load Securing',
            'ADR',
            'Driver CPC Module 1 (CVEDT)',
            'Driver CPC Module 2 (MRMET)',
            'Driver CPC Module 3 (HSOPD)',
            'Driver CPC Module 4 (RPDTI)',
            'Driver CPC Module 5 (PROTD)',
            'Driver CPC Module 6 (PROBD)',
            'Driving Licence Category C',
            'Driving Licence Category C1',
            'Driving Licence Category CE',
            'Driving Licence Category C1E',
            'Driving Licence Category BE'
        ]
    },

    security_section:{
        type:String,
        enum:[
            'Safe Pass',
            'Manual Handling',
            'Occupational First Aid',
            'Guarding Skills QQI Level 4',
            'Door Security Procedures QQI Level 4'    
        ]
    },

    healthcare_section:{
        type:String,
        enum:[
            'FETAC Level 5 Certificate in Health Care Support',
            'Manual Handling',
            'Child protection',
            'Violence and aggression',
            'Hand hygiene',
            'Clinical waste awareness/disposal training',
            'Chemical Awareness/safety',
            'Forklift',
            'Waste compactor training',
            'Isolation precaution training',
            'Fire Training',
            'Patient Lifting & Moving',
            'Occupational First Aid'
        ]
    },

    childcare_section:{
        type:String,
        enum:['Childcare']
    },

    forestry_operations:{
        type:String,
        enum:[
            'Manual Handling',
            'Basic First Aid(Lantra)',
            'Safe Pass',
            'CSCS 360° Excavator',
            'Hiab Operator',
            'Driver CPC Module 1 (CVEDT)',
            'Driver CPC Module 2 (MRMET)',
            'Driver CPC Module 3 (HSOPD)',
            'Driver CPC Module 4 (RPDTI)',
            'Driver CPC Module 5 (PROTD)',
            'Driver CPC Module 6 (PROBD)',
            'Manual Handling',
            'Basic First Aid(Lantra)',
            'Safe Pass',
            'CSCS 360° Excavator',
            'Hiab Operator',
            'Driver CPC Module 1 (CVEDT)',
            'Driver CPC Module 2 (MRMET)',
            'Driver CPC Module 3 (HSOPD)',
            'Driver CPC Module 4 (RPDTI)',
            'Driver CPC Module 5 (PROTD)',
            'Driver CPC Module 6 (PROBD)'
        ]
    },    

    expiry_date:{
        type: String
    },
    issue_date:{
        type: String
    },
    file_cert:{
        type: String
    },
    updated:{ 
        type: Date,
        default: Date.now
    },
    status:{
        type: String,
        enum: ['approved','pending','unapproved'],
        default: 'pending'
    },
    comment:{
        type: String,
        default: Date.now
    }
    // ,
    // shared:[{
        // requester: { type: mongoose.Schema.ObjectId, ref: 'User'},
        // recipient: { type: mongoose.Schema.ObjectId, ref: 'User'},
        // sharing: { type: mongoose.Schema.ObjectId, ref: 'User'},
        // shared_to: { type: mongoose.Schema.ObjectId, ref: 'User'},
        // status:{
            // type: String,
            // enums: ['requested', 'pending', 'connected']
        // },
    // }]

});

// let Cert = module.exports = mongoose.model('Cert', certSchema);
module.exports = certSchema;