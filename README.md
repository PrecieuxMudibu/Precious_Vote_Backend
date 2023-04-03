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


### Route for get candidates

Route : http://localhost:8000/api/get_candidates/642a0b47bcb981f2fe6484f7/6429f1003ad404877bdbef0c

The first parameter in the route is the election_id and the second is the post_id.






### Send an email for confirm that an account has been activate successfully
Route : http://localhost:3000/api/activate-account

You have to do a post request with a JSON object like this.
{
    "lang": "en",
    "data": {
        "name": "Précieux",
        "email": "mudibuprecieux@gmail.com",
        "sexe": "Homme"
    }
}

### Send an email for confirm that an account has been activate successfully
Route : http://localhost:3000/api/activate-account

You have to do a post request with a JSON object like this.
{
    "lang": "en",
    "data": {
        "name": "Précieux",
        "email": "mudibuprecieux@gmail.com",
        "sexe": "Homme"
    }
}

### Send an email for notify that the password has been changed successfully
Route : http://localhost:3000/api/notify-password-changed

You have to do a post request with a JSON object like this.
{
    "lang": "fr",
    "data": {
        "name": "Précieux",
        "email": "mudibuprecieux@gmail.com",
        "sexe": "Homme"
    }
}

### Send an email which contain the code for change password
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
[Jeereq Minganda](https://github.com/PrecieuxMudibu)