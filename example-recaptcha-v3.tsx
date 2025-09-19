// Example for reCAPTCHA v3 implementation
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';

// In your app root
function App() {
  return (
    <GoogleReCaptchaProvider reCaptchaKey="YOUR_SITE_KEY">
      <YourComponent />
    </GoogleReCaptchaProvider>
  );
}

// In your component
function YourComponent() {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async () => {
    if (!executeRecaptcha) {
      console.log('Execute recaptcha not yet available');
      return;
    }

    const token = await executeRecaptcha('submit');
    // Send token to your backend
  };
}