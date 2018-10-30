import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { toggle_run } from '../actions/indexAction';

 class Display extends Component{
    constructor(props){
        super(props);
        this.state = {
          trackCount: 0,
          remainingTime: 0,
          loopDone: 1,
          referenceValue: 0
        }
        this.launchExercise = this.launchExercise.bind(this)
        this.countDown = this.countDown.bind(this)
    };

    componentDidUpdate(prevProps) {
      if (this.props.running !== prevProps.running){
        this.audioPlayer('stop')
      }
      if (this.props.running !== prevProps.running && this.props.running) {
        this.launchExercise();
      }
    }

    resetStates(){
      this.setState({ trackCount: 0, loopDone: 1, on: false });
      this.props.toggle_run();
    }

    countDown(restart){
      if (this.state.remainingTime -1 >= 0 && this.props.running){
        if( this.state.referenceValue >= 20 && this.state.remainingTime == 10 ){
          this.audioPlayer('tenSeconds')
        }
        this.setState({ remainingTime: this.state.remainingTime - 1 });
        setTimeout(function(){ this.countDown(restart) }.bind(this), 1000)
      }else if(restart){
        this.launchExercise()
      }else{
        this.start()
      }
      console.log(this.state.remainingTime)
    }

    audioPlayer(sound){
      const audioGetReady = new Audio("https://res.cloudinary.com/dyub4bz6x/video/upload/v1539540139/sounds/get_ready.mp3")
      const audioTenSec = new Audio('https://res.cloudinary.com/dyub4bz6x/video/upload/v1540927160/sounds/10_more_seconds.mp3');
      const audioNext = new Audio('https://res.cloudinary.com/dyub4bz6x/video/upload/v1539530167/sounds/next_exercise.mp3');
      const audioRest = new Audio('https://res.cloudinary.com/dyub4bz6x/video/upload/v1539531176/sounds/time_to_rest.mp3')
      const audioCongrats = new Audio('https://res.cloudinary.com/dyub4bz6x/video/upload/v1539529922/sounds/congratulation.mp3')

      if(sound == 'getReady'){
        audioGetReady.play()
      }
      if(sound == 'tenSeconds'){
        audioTenSec.play()
      }
      if(sound == 'next'){
        audioNext.play()
      }
      if(sound == 'rest'){
        audioRest.play()
      }
      if(sound == 'congrats'){
        audioCongrats.play()
      }
      // if(sound == 'stop'){
      //   audioGetReady.pause();
      //   audioGetReady.currentTime = 0;
      //   audioTenSec.pause();
      //   audioTenSec.currentTime = 0;
      //   audioNext.pause();
      //   audioNext.currentTime = 0;
      //   audioRest.pause();
      //   audioRest.currentTime = 0;
      //   audioCongrats.pause();
      //   audioCongrats.currentTime = 0;
      // }
    }

    start() {
      const trackCount = this.state.trackCount;
      const loopDone = this.state.loopDone;
      const exerciseTime = this.props.time + 1;
      const restTime = this.props.rest + 1;
      // progression
      const endOfTrack = trackCount === this.props.serie && loopDone < this.props.loop
      console.log(this.state.trackCount, this.props.running );
      this.setState({ trackCount: trackCount +1});
      if (trackCount < this.props.serie && this.props.running){
        if (trackCount > 0){
          this.audioPlayer('next')
        }
        this.setState({ remainingTime: exerciseTime, referenceValue:  exerciseTime - 1  })
        this.countDown(false);
      } else if (this.props.running) {
        if(loopDone == this.props.loop){
          if (this.props.running){
            this.audioPlayer('congrats')
          }
          this.resetStates();
        }
        if (endOfTrack){
          if(restTime !== 0){
            this.audioPlayer('rest')
            this.setState({ remainingTime: restTime, referenceValue:  restTime - 1  })
            this.countDown(true);
            this.setState({ loopDone: loopDone +1, trackCount: 0 });
          }
          else{
            this.launchExercise()
          }
        }
      }
    }

    launchExercise(){
      console.log(this.props.running)
      if(this.props.running){

        console.log('start', this.state)
        this.audioPlayer('getReady');
        // console.log('get ready')
        setTimeout(function(){ this.start() }.bind(this),6000);
        // this.start()
      }else{
        console.log('exit')
        return;
      }
    }

    render(){
        const progression = { width: this.state.remainingTime / this.state.referenceValue *100 +"%"}
        return(
          <div className="flex-column">
            <div className="bar">
              <div className="progression" style={progression}>
                <h1>{ this.state.remainingTime } / { this.state.referenceValue } </h1>
              </div>
            </div>
          </div>
    )}
}

export default connect(
   state => ({
       time: state.time,
       serie: state.serie,
       rest: state.rest,
       loop: state.loop,
       running: state.running
   }),
   dispatch => ({
      toggle_run: bindActionCreators(toggle_run, dispatch),
   })
)(Display);
