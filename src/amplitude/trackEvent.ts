import axios from 'axios';

const AMPLITUDE_API_KEY = process.env.AMPLITUDE_API_KEY;
if (!AMPLITUDE_API_KEY) {
  throw new Error('Amplitude API key is missing!');
}

const trackEvent = async (
  eventType: string,
  userId: string,
  eventProperties: Record<string, any>,
) => {
  try {
    const response = await axios.post(process.env.AMPLITUDE_HTTP_API_URL, {
      api_key: AMPLITUDE_API_KEY,
      events: [
        {
          event_type: eventType,
          user_id: userId,
          event_properties: eventProperties,
        },
      ],
    });

    console.log('Amplitude Event Tracked:', response.data);
  } catch (error) {
    console.error(
      'Error tracking Amplitude event:',
      error.response?.data || error.message,
    );
  }
};

export default trackEvent;
