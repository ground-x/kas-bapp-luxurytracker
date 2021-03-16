import React, { Component, createRef } from "react";
import QrReader from "react-qr-reader";

// import { filter } from 'lodash'

// import { checkAndroidVersion } from 'utils/utils'
// import { TOAST_DURATION, ANDROID_KAKAO_CAMERA_SCAN_VERSION } from 'constant/constant'

class TextareaComponent extends Component {
  constructor(props) {
    super(props);

    this.fileLoaderRef = createRef();

    this.state = {
      // cameraOn: false,
      // shouldAccessCamera: true,
    };

    this.rootDom = document.getElementsByClassName("page")[0];
    this.walletDom = document.getElementsByClassName("accountSlide")[0];
    this.slideDomStyle = "bottom: 0px; transition: transform 0ms;";
    this.styleSet = "height:auto;overflow:visible;";
  }

  // componentDidMount() {
  //   if (!navigator || !navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
  //     return this.setState({
  //       shouldAccessCamera: false,
  //     })
  //   }

  //   const setAccessCam = this.setShouldAccessCamera

  //   // List cameras and microphones.
  //   navigator.mediaDevices.enumerateDevices()
  //     .then(function (devices) {
  //       const deviceList = []
  //       devices.forEach(function (device) {
  //         if (device.kind === 'videoinput') {
  //           deviceList.push(device)
  //         }
  //       })
  //       const filteredDevices = filter(deviceList, ({ deviceId, label }) => deviceId && label)
  //       setAccessCam(!!filteredDevices.length)
  //     })
  //     .catch(function () {
  //       setAccessCam(false)
  //     })
  //   return null
  // }

  // setShouldAccessCamera = (value) => {
  //   this.setState({
  //     shouldAccessCamera: value,
  //   })
  // }

  // handleError = (err) => {
  //   Toast.info('접근 권한이 없어 해당 기능을 사용할 수 없습니다.', TOAST_DURATION, this.onScanError, false)
  // }

  // toggleCamera = (value) => {
  //   this.setState((state) => ({
  //     cameraOn: value || !state.cameraOn,
  //   }))
  // }

  // onScanError = () => {
  //   this.setState({
  //     shouldAccessCamera: false,
  //     cameraOn: false,
  //   })
  // }

  // onScanSuccess = (data) => {
  //   const { handleScan } = this.props
  //   if (data) {
  //     this.setState({
  //       cameraOn: false,
  //     }, () => {
  //       handleScan(data)
  //     })
  //   }
  // }
  handleScan = (data) => {
    console.log(data);
  };

  onImageScan = (data) => {
    if (data) {
      this.handleScan(data);
      this.props.handleValueChangeQR({ target: { name: "qr", value: data } });
    } else {
      alert("사용 가능한 QR 코드 이미지를 입력해주세요.");
    }
  };

  render() {
    // const {
    //   title,
    //   placeholder,
    //   errorText,
    //   error,
    //   showQR,
    //   onChange,
    //   count,
    //   // handleScan,
    //   address,
    //   hideBtn,
    //   editable,
    // } = this.props
    // const { shouldAccessCamera } = this.state

    // const { cameraOn } = this.state
    // const canAccessCamera = shouldAccessCamera && checkAndroidVersion(ANDROID_KAKAO_CAMERA_SCAN_VERSION)

    return (
      <div>
        <div>
          {/* 파일 업로드하기 버튼 */}
          <button
            onClick={() => {
              this.fileLoaderRef.current.openImageDialog();
            }}
          >
            UPLOAD
          </button>
        </div>

        {/* 파일 업로드 담당 부분 */}
        <QrReader
          display="none"
          className="file-loader"
          ref={this.fileLoaderRef}
          onScan={this.onImageScan}
          style={{ width: "50%" }}
          legacyMode
          onError={(err) => console.log(err)}
        />
      </div>
    );
  }
}

export default TextareaComponent;
