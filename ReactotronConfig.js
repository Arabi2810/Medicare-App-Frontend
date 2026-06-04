import Reactotron from 'reactotron-react-native';

Reactotron.configure({ name: 'MediCare' })
  .useReactNative({
    networking: {
      ignoreUrls: /symbolicate/,
    },
  })
  .connect();
