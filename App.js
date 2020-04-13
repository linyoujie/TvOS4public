'use strict';
import React, {
  Component
} from 'react';
import {
  TextInput,
  AppRegistry,
  StyleSheet,
  View,
  Dimensions,
  Text,
  Button,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  StatusBar,
} from 'react-native';
import Util from './Utils'
import { Video } from 'expo-av';
import { MaterialIcons, Octicons } from '@expo/vector-icons';
//import * as ScreenOrientation from 'expo-screen-orientation';
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded
} from 'expo-ads-admob';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import readData from './playlist.json';


export default class App extends React.Component {
  constructor(props) {

    super(props);
    this.state = {
      mute: false,
      fullScreen: false,
      shouldPlay: true,
      playlist: [{ 'title': "Loading" }],
    }
    this.onLayout = this.onLayout.bind(this);
  }

  getPlaylist(patientId) {
    fetch('http://***')
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        this.setState({ playlist: responseJson });
      })
      .catch((error) => {
        Alert.alert("Error");
      });

    //console.log('1')
  };

  componentWillMount() {
    this.setState({ playlist: readData })
    this.resizeVideoPlayer();
    activateKeepAwake();
  }
  handlePlayAndPause = () => {
    this.setState(prevState => ({
      shouldPlay: !prevState.shouldPlay
    }));
  }

  handleVolume = () => {
    this.setState(prevState => ({
      mute: !prevState.mute,
    }));
  }


  showRewarded = async () => {
    // first - load ads and only then - show
    await AdMobRewarded.requestAdAsync({ servePersonalizedAds: true });
    await AdMobRewarded.showAdAsync();

  }


  componentDidMount() {
    this.getPlaylist();
    this.timer = setInterval(() => this.getPlaylist(), 600000);


    AdMobRewarded.setAdUnitID('ca-app-pub-3940256099942544/5224354917');
    AdMobRewarded.setTestDeviceID('EMULATOR');

    this.showRewarded()

  }



  render() {
    //console.log(readData)


    var styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'flex-start',
        //alignItems: 'center',
        flexDirection: 'row',
        //backgroundImage: 'url(/assets/background.png)'
        //backgroundColor: 'white',

        justifyContent: 'center',

        marginLeft: -20
      },
      controlBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: this.state.orientationHeight * 0.5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      },

      playList: {
        width: this.state.orientationWidth * 0.25,
        height: this.state.orientationWidth * 0.25,

        //marginTop: this.state.orientationWidth * 0.02,
        //alignSelf: 'flex-start',
        //justifyContent: 'flex-start',
        //marginLeft: -50
        marginLeft: -150,

        justifyContent: 'center',


      },

      item: {
        backgroundColor: '#00000050',

        padding: 10,
        //marginRight: 10,
        marginVertical: 12,
        marginRight: 40,
        color: 'white',
        fontSize: 20,
      },

      text_playlist: {
        //fontFamily: '',
        marginTop: this.state.orientationWidth * 0.10,
        fontSize: 25,
        color: 'white',
        paddingBottom: 20,
        width: 280,
        borderBottomColor: 'white',
        borderBottomWidth: 2,
        //borderBottomEndRadius:80,
        marginBottom: 10,


      },
      text_title: {
        //fontFamily: '',
        marginTop: this.state.orientationWidth * 0.004,
        fontSize: 25,
        marginLeft: this.state.orientationWidth * 0.04,
        //alignItems: 'flex-start',
        color: 'white',

      },
      backgroundIMG: {
        flex: 1,
        // remove width and height to override fixed static size
        width: null,
        height: null,

      },
      backgroundScreen: {
        //flex: 1,
        // remove width and height to override fixed static size
        //width: null,
        //height: null,
        color: "white"
      },


      title: {
        fontSize: 32,

      }

    });

    //ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
    //console.log(this.state.playlist[0].title)
    //console.log(this.state.orientationWidth)
    return <ImageBackground source={require('./assets/background.png')} style={styles.backgroundIMG}>
      <StatusBar hidden={true} />


      <View style={{ flex: 1, flexDirection: "column" }}>

        <View onLayout={this.onLayout} style={styles.container}>

          <View style={{ flex: 2, width: this.state.orientationWidth * 0.5, justifyContent: 'center', }}>

            <View style={{ justifyContent: 'space-between', }}>
              <View style={{ borderColor: 'white', borderWidth: 2, marginLeft: 50, marginTop: this.state.orientationWidth * 0.02, width: this.state.orientationWidth * 0.5 + 4 }}>
                <TouchableOpacity

                  onPress={//this.onPress.bind(this)
                    this.handlePlayAndPause
                    //this.showInterstitial
                  }>

                  <Video
                    //source={{ uri: 'http://****/.m3u8' }}
                    source={require('./broadchurch.mp4')}
                    shouldPlay={this.state.shouldPlay}
                    ref={p => { this.videoPlayer = p; }}
                    isMuted={false}
                    style={{ width: this.state.orientationWidth * 0.5, height: this.state.orientationHeight * 0.5 }}
                    controls={true}
                    resizeMode="cover"
                  />

                  <View style={this.state.shouldPlay ? { height: 0 } : styles.controlBar}>
                    <MaterialIcons
                      name={this.state.shouldPlay ? "" : "play-arrow"}
                      size={45}
                      color="white"
                    //onPress={this.handlePlayAndPause}

                    />
                  </View>

                </TouchableOpacity>
              </View>
              <Text style={styles.text_title}>Now Watching: {this.state.playlist[0].title}</Text>
            </View>
          </View>
          <View style={{ justifyContent: 'center', marginTop: -1 * this.state.orientationWidth * 0.095 }}>
            <View style={styles.playList}>
              <TextInput
                style={styles.text_playlist}
                editable={false}
                value={'Schedule (EST)'} />


              <View style={styles.FlatList}>
                <FlatList

                  data={this.state.playlist.slice(1, 8)}
                  renderItem={({ item }) => <Text style={styles.item}>{item.start_time}  {item.title}  </Text>}
                />
              </View>

            </View>



          </View>

        </View>

        <View style={{ height: 60, justifyContent: "flex-end" }}>
          <PublisherBanner
            bannerSize="smartBannerLandscape"
            adUnitID="ca-app-pub-3940256099942544/6300978111"
            //testDeviceID="EMULATOR"
            didFailToReceiveAdWithError={this.bannerError}
            admobDispatchAppEvent={this.adMobEvent} />
        </View>
      </View>

    </ImageBackground >


  }

  onPress() {
    if (this.videoPlayer != null)
      this.videoPlayer.presentFullscreenPlayer();
    //this.handlePlayAndPause;
  }

  resizeVideoPlayer() {
    // Always in 16 /9 aspect ratio

    let { width, height } = Dimensions.get('window');

    /*if (Util.isPortrait()) {
      this.setState({
        orientationWidth: width * 0.8,
        orientationHeight: width * 0.8 * 0.56,
      });
    } else {
      this.setState({
        orientationHeight: height * 0.8,
        orientationWidth: height * 0.8 * 1.77
      });
    }*/

    this.setState({
      orientationHeight: width * 0.7,
      orientationWidth: width * 0.7 * 1.77
    });
  }

  onLayout(e) {
    console.log('on layout called');
    this.getPlaylist()
    //console.log(this.state.playlist)
    this.resizeVideoPlayer();
  }
}

