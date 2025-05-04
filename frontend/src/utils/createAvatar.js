// Ready Player Me Avatar Creation Utility
export const createCustomAvatar = () => {
  return new Promise((resolve) => {
    const subdomain = 'maand-avatar'; // Replace with your subdomain
    const frame = document.createElement('iframe');
    frame.style.width = '100%';
    frame.style.height = '100%';
    frame.style.border = 'none';
    frame.style.position = 'fixed';
    frame.style.top = '0';
    frame.style.left = '0';
    frame.style.zIndex = '9999';
    frame.src = `https://${subdomain}.readyplayer.me/avatar?frameApi`;

    document.body.appendChild(frame);

    window.addEventListener('message', subscribe);
    document.addEventListener('message', subscribe);

    function subscribe(event) {
      const json = parse(event);

      if (json?.source !== 'readyplayerme') {
        return;
      }

      // Get avatar GLB URL
      if (json.eventName === 'v1.avatar.exported') {
        const avatarUrl = json.data.url;
        document.body.removeChild(frame);
        window.removeEventListener('message', subscribe);
        document.removeEventListener('message', subscribe);
        resolve(avatarUrl);
      }

      // Get user click on close button
      if (json.eventName === 'v1.exit') {
        document.body.removeChild(frame);
        window.removeEventListener('message', subscribe);
        document.removeEventListener('message', subscribe);
        resolve(null);
      }
    }
  });
};

function parse(event) {
  try {
    return JSON.parse(event.data);
  } catch (error) {
    return null;
  }
}

// Avatar URL validation
export const isValidAvatarUrl = (url) => {
  if (!url) return false;
  try {
    const avatarUrl = new URL(url);
    return avatarUrl.hostname === 'models.readyplayer.me' && avatarUrl.pathname.endsWith('.glb');
  } catch {
    return false;
  }
};

// Default avatar URL if user doesn't create one
export const DEFAULT_AVATAR_URL = 'https://models.readyplayer.me/64c3a7c3d9f4d2e9a89a7f1e.glb'; 