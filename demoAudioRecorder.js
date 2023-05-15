/* eslint-env browser */
var recorder = null;
var supportsWebm =
  window.MediaRecorder &&
  MediaRecorder.isTypeSupported &&
  MediaRecorder.isTypeSupported("audio/webm;codecs=opus");
var mimeType = supportsWebm ? "audio/webm;codecs=opus" : "audio/mp4";
var fileExtension = supportsWebm ? "webm" : "mp4";
var API_TOKEN = "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";

// let audioPlay = true;

// This example uses MediaRecorder to record from a live audio stream,
// and uses the resulting blob as a source for an audio element.
//
// The relevant functions in use are:
//
// navigator.mediaDevices.getUserMedia -> to get audio stream from microphone
// MediaRecorder (constructor) -> create MediaRecorder instance for a stream
// MediaRecorder.ondataavailable -> event to listen to when the recording is ready
// MediaRecorder.start -> start recording
// MediaRecorder.stop -> stop recording (this will generate a blob of data)
// URL.createObjectURL -> to create a URL from a blob, which we can use as audio src

function audioRecorder(stream) {
  recorder = new MediaRecorder(stream);

  // listen to dataavailable,
  // which gets triggered whenever we have
  // an audio blob available
  recorder.addEventListener("dataavailable", onRecordingReady);
}

async function onRecordingReady(e) {
  //
  // listen recording (audio play)
  // just if speech is not aborted
  //
  // if (audioPlay) {
  //
  // you don't want to record while playing (through loudspeakers),
  // to avoid that playback audio feedback in the mic input!
  //

  console.log(DEFAULT_PARAMETERS_CONFIGURATION);
  if (!DEFAULT_PARAMETERS_CONFIGURATION.recordingStopped) {
    console.log("should restart");
    suspendRecording();
    resumeRecording();
  } else {
    console.log("onRecordingReady abort");
    recorder.stop();
    return;
  }

  const blob = new Blob([e.data], { type: e.data.type });
  const formData = new FormData();
  formData.append("model", "whisper-1");
  formData.append("response_format", "verbose_json");
  // formData.append("file", blob, `recording.${fileExtension}`);
  // try {
  //   const response = await fetch(
  //     "https://api.openai.com/v1/audio/transcriptions",
  //     {
  //       method: "POST",
  //       headers: {
  //         Authorization: "Bearer " + API_TOKEN,
  //       },
  //       body: formData,
  //     }
  //   );

  //   const json = await response.json();

  //   if (response.status === 200) {
  //     transcript = json.text;
  //     console.log("json", { json });
  //     console.log("value", json.segments[0].no_speech_prob);
  //     if (json.segments[0].no_speech_prob < 0.5) {
  //       console.log("got transcript", json.text);
  //     } else {
  //       console.log("silence", json.text);
  //     }
  //   } else {
  //     console.log("got error:", json.error);
  //   }
  // } catch (error) {
  //   console.log("catch", error);
  // }

  // e.data contains a blob representing the recording

  // audio.play();

  //
  // you want to resume recording after the audio playback
  //
  // audio.onended = () => {
  //   console.log('recordingEnabled ' + DEFAULT_PARAMETERS_CONFIGURATION.recordingEnabled)
  // };
  // }
}

function startRecording() {
  recorder.start();
}

function stopRecording() {
  // Stopping the recorder will eventually trigger the `dataavailable` event and we can complete the recording process
  recorder.stop();
  // audioPlay = true;
}

/**
 * restartRecording
 *
 * abort and start
 */
function restartRecording() {
  // https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/state
  //console.log('recorder ' +  recorder.state )

  // need otherwise I get on Chrome the error:
  // Failed to execute 'stop' on 'MediaRecorder': The MediaRecorder's state is 'inactive'.
  console.log("restart: recordingEnabled", DEFAULT_PARAMETERS_CONFIGURATION);
  if (recorder.state != "inactive") recorder.stop();

  // audioPlay = false;
  recorder.start();
}

function abortRecording() {
  // Stopping the recorder will eventually trigger the `dataavailable` event and we can complete the recording process
  recorder.stop();
  // audioPlay = false;
}

function userStoppedRecording() {
  DEFAULT_PARAMETERS_CONFIGURATION.recordingStopped = true;
  DEFAULT_PARAMETERS_CONFIGURATION.recordingEnabled = false;
  console.log(
    "userStopped: recordingEnabled",
    DEFAULT_PARAMETERS_CONFIGURATION
  );
  recorder.stop();
}

function userResumedRecording() {
  DEFAULT_PARAMETERS_CONFIGURATION.recordingStopped = false;
  DEFAULT_PARAMETERS_CONFIGURATION.recordingEnabled = true;
  console.log(
    "userResumed: recordingEnabled",
    DEFAULT_PARAMETERS_CONFIGURATION
  );
  if (recorder.state != "inactive") recorder.stop();
  recorder.start();
}

// to suspend recording when the system play audio with a loudspeaker, avoiding feedback
function suspendRecording() {
  DEFAULT_PARAMETERS_CONFIGURATION.recordingEnabled = false;
  console.log(
    "suspend: recordingEnabled",
    DEFAULT_PARAMETERS_CONFIGURATION.recordingEnabled
  );
}

function resumeRecording() {
  DEFAULT_PARAMETERS_CONFIGURATION.recordingEnabled = true;
  console.log("resume: recordingEnabled", DEFAULT_PARAMETERS_CONFIGURATION);
}
