# itm-send-email : API for sending email

## Installation

Clone the repo with the command **git clone**
Install all dependancies with the command **npm install**

## Project done with

**JavaScript**
**Express JS**
**Mongoose**
**Prettier**

## How to use this API

Create an env file with environment variables like the env.template file.

### Route for register

Route : http://localhost:3000/api/register

You have to do a post request with a JSON object like this.

{
    "name": "Stark",
    "first_name": "Tony",
    "post_name": "Edouard",
    "email": "tonystark@gmail.com",
    "password": "L0veyou3*1000"
}

### Route for login

Route : http://localhost:3000/api/login

You have to do a post request with a JSON object like this.

{
    "email": "tonystark@gmail.com",
    "password": "L0veyou3*1000"
}

### Route for create a post

Route : http://localhost:8000/api/create_post

You have to do a post request with a JSON object like this.

{
  "name": "Vice-Sécrétaire"
}

### Route for create an election

Route : http://localhost:8000/api/create_election

You have to do a post request with a JSON object like this.

{
        "user_id": "642947499e82b0fe63a54758",
        "name":"Election G3 MAth-info",
        "description":"lorem 133F,sk,c,,",
        "first_round_eligibility_criteria": 50,
        "electors": [
          {
            "first_name":"Tony",
            "name":"Stark"
          },
           {
            "first_name":"Steve",
            "name":"Rogers"
          },
          {
            "first_name":"Natasha",
            "name":"Romanoff"
          },
          {
            "first_name":"Clint",
            "name":"Barton"
          },
          {
            "first_name":"Bruce",
            "name":"Banner"
          },
          {
            "first_name":"Thor",
            "name":"Odinson"
          },
            {
            "first_name":"Stephen",
            "name":"Strange"
          },
            {
            "first_name":"Peter",
            "name":"Parker"
          }
          ],
        "candidates": [
            {
                "post": "President",
                "people": [
                     {
                        "name":"Stark",
                        "first_name":"Tony",
                        "picture":"Image"
                     },
                     {
                        "name":"Rogers",
                        "first_name":"Steve",
                        "picture":"Image"
                     },
                     {
                        "name":"Danvers",
                        "first_name":"Carol",
                        "picture":"Image"
                     }

                ]
            },
            {
                "post": "Vice-président",
                "people": [
                     {
                        "name":"Parker",
                        "first_name":"Peter",
                        "picture":"Image"
                     },
                     {
                        "name":"Bishop",
                        "first_name":"Kate",
                        "picture":"Image"
                     },
                     {
                        "name":"Khan",
                        "first_name":"Kamala",
                        "picture":"Image"
                     }

                ]
            }
            
            
            ]
}

### Route for get candidates

Route : http://localhost:8000/api/get_candidates/642a0b47bcb981f2fe6484f7/6429f1003ad404877bdbef0c

You have to do a post request with a JSON object like this.

The first parameter in the route is the election_id and the second is the post_id.









Route : http://localhost:3000/api/send-code-for-change-password

You have to do a post request with a JSON object like this.

  {
        "lang": "fr",
        "data": {
          "name": "Précieux",
          "email": "mudibuprecieux@gmail.com",
          "sexe": "Homme",
          "link": "facebook.com",
          "code": 1234
        }
  }

## Authors
[Precieux Mudibu](https://github.com/PrecieuxMudibu)