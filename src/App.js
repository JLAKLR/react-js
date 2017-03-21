/* ROOT Component of your App  */

import React, { Component } from 'react'
import logo from './logo1.jpg'
import './App.css'

import defaultPicture from './components/img/default.jpg'

const Materialize = window.Materialize

const APP_TITLE = 'What championship do u want?'
//update document title (displayed in the opened browser tab)
document.title = APP_TITLE

//web api utils
import { get, ENDPOINTS } from './utils/api'

//components
import captionCard from './components/captionCard'

class App extends Component {

    /* React state initialization DOCUMENTATION : https://facebook.github.io/react/docs/react-without-es6.html#setting-the-initial-state */

    constructor( props ) {
        super( props )
        this.state = {
          caption: '',
                      league: ''
          }
    }


    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <h1>{ APP_TITLE }</h1>
                    <img src={ logo } className="App-logo" alt="logo" />
                </div>

                <div className="App-content">
                    <div className="center-align">

                        <form onSubmit={ this.fetchcaption }>

                            <div className="row" style={ { marginBottom: 0 } }>
                                <div className="input-field col s6 offset-s3">
                                    <input id="leagueInput" type="text" value={ this.state.league } onChange={ this.handleChange } />
                                    <label htmlFor="leagueInput">Write the name of a football league (in his own language)</label>
                                </div>
                            </div>

                            <button type="submit" className="waves-effect waves-light btn">
                                caption?
                            </button>

                        </form>

                    </div>

                    <div className="row" style={ { marginTop: 20 } } >
                        <div className="col s12 m6 offset-m3">
                            { this.displaycaptionInfo() }
                        </div>
                    </div>
                </div>

            </div>
        )
    }



    handleChange = ( event ) => {
        this.setState( {
            league: event.target.value
        } )
    }


    //method triggered by onSubmit event of the form or by onClick event of the "caption?" button
    /* Arrow function syntax used for Autobinding, see details here : https://facebook.github.io/react/docs/react-without-es6.html#autobinding */
    fetchcaption = async ( event ) => {

        event.preventDefault()

        /* ASYNC - AWAIT DOCUMENTATION : https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Op%C3%A9rateurs/await */

        try {
          var caption = "";
          caption = this.state.league;
          caption = caption.replace(/ /g,"+");
          var url = "http://api.football-data.org/v1/soccerseasons" + caption;

          let updatedcaption = await this.fetchPicture(caption)

              this.setState({
              caption: updatedcaption
          })


        }
        catch ( error ) {
            Materialize.toast( error, 8000, 'error-toast' )
            console.log( 'Failed fetching data: ', error )
        }


        var request = require('request-promise');

        var options= {
        headers: {'X-Auth-Token': 'c3d6342a5384462c95524b2ddb68248d'},
        url: 'http://api.football-data.org/v1/soccerseasons',
        type:'GET',
        };

        request.get(options).then(function(body) {
        var json = JSON.parse(body);

        console.log(json);
      })
    }



    //will fetch a picture with the name of the league fetched by the caption API
    //will return an updated caption object (same object + one image)
    fetchPicture = async ( caption ) => {


        return caption
    }


    //handle display of the received caption object
    displaycaptionInfo = () => {
        const caption = this.state.caption

        /*
            DATA FORMAT SENT BY THE API LOKKS LIKE THIS :

            {
                "pixabayPicture": string, //CUSTOM ADD VIA PIXABAY API CALL
                "location": {
                    "name": string,
                    "region": string,
                    "country": string,
                    "lat": number,
                    "lon": number,
                    "tz_id": string,
                    "localtime_epoch": number,
                    "localtime": string
                },
                "current": {
                    "temp_c": number,
                    "is_day": boolean,
                    "condition": {
                        "text": string,
                        "icon": string
                    },
                    "wind_kph": number
                }
            }

        */

        if ( caption ) {

            const locationName = caption.location.name
            const temperature = caption.current.temp_c
            const captionConditionText = caption.current.condition.text
            const captionConditionIcon = caption.current.condition.icon
            const windSpeed = caption.current.wind_kph
            const picture = caption.pixabayPicture

            return (
                <captionCard
                    locationName={ locationName }
                    temperature={ temperature }
                    captionConditionText={ captionConditionText }
                    captionConditionIcon={ captionConditionIcon }
                    windSpeed={ windSpeed }
                    picture={ picture } />
            )
        }

        return null
    }

}

export default App
