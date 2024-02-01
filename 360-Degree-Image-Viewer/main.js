const urlParam = new URLSearchParams(window.location.search).get('url');

// Use the URL as needed
if (urlParam) {
  const imageURL = urlParam
  console.log(urlParam)
  // Perform actions with the image URL
  const panoramaImage = new PANOLENS.ImagePanorama(imageURL);

  const imageContainer = document.querySelector(".image-container");

  const viewer = new PANOLENS.Viewer({
    container: imageContainer,
    autoRotate: true,
    autoRotateSpeed: 0.3,
    controlBar: false,
  });

  viewer.add(panoramaImage);

} else {
  console.error('Image URL not provided.')
}

// const panoramaImage = new PANOLENS.ImagePanorama("images/image2.jpg");
// const imageContainer = document.querySelector(".image-container");

// const viewer = new PANOLENS.Viewer({
//   container: imageContainer,
//   autoRotate: true,
//   autoRotateSpeed: 0.3,
//   controlBar: false,
// });

// viewer.add(panoramaImage);