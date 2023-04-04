// Use DBML to define your database structure
// Docs: https://www.dbml.org/docs

Table users {
  _id ObjectId [primary key]
  email String
  nickname String
  name String
  password String
  birthdate Date
  role String
}

Table tournaments {
  _id ObjectId [primary key]
  name String
  organizer ObjectId
  game ObjectId
  start Date
  end Date
  startRegistration Date
  endRegistration Date
  teams Array
  maxTeams Int32
  gameMode String
  place String
}


Table games {
  _id ObjectId [primary key]
  name String
  shortName String
  slug String
  description String
}

Table errors {
  _id ObjectId [primary key]
  error String
  dateOfError Date
}


Table teams {
  _id ObjectId [primary key]
  name String
  shortName String
  players Array
  owner ObjectId
  invatitions Boolean
}

Table matches {
  _id ObjectId [primary key]
}

Table brackets {
  _id ObjectId [primary key]
}

Table groups {
  _id ObjectId [primary key]
}

Table teamInvitations {
  _id ObjectId [primary key]
  team ObejctId
  from ObjectId
  to ObjectId
}

Ref: teams.players > users._id
Ref: tournaments.teams > teams._id
Ref: tournaments.organizer - users._id
Ref: tournaments.game - games._id
Ref: teams.owner - users._id
Ref: teamInvitations.team - teams._id
Ref: teamInvitations.from - users._id
Ref: teamInvitations.to - users._id