const timeElement = document.getElementById("time");

const speedResult = document.getElementById('speed-result');
const testButton = document.getElementById('test-button');

testButton.addEventListener('click', () => {
  testButton.disabled = true;
  testButton.textContent = 'Testing...';

  testInternetSpeed().then(speed => {
    speedResult.textContent = `${speed.toFixed(2)} Mbps`;
    testButton.disabled = false;
    testButton.textContent = 'Test Speed';
  });
});

testButton.addEventListener('click', () => {
  testButton.disabled = true;
  testButton.textContent = 'Testing...';
  speedResult.textContent = '';

  testInternetSpeed().then(speed => {
    speedResult.textContent = `${speed.toFixed(2)} Mbps`;
    testButton.disabled = false;
    testButton.textContent = 'Test Speed';
  });
});

async function testInternetSpeed() {
  const token = await fetch('https://fast.com/app-ed402d.js')
    .then(response => response.text())
    .then(text => text.match(/token:"(.+?)"/)[1]);

  const startUrl = `https://api.fast.com/netflix/speedtest?https=true&token=${token}&urlCount=5`;
  const testUrl = await fetch(startUrl)
    .then(response => response.json())
    .then(data => data[0].url);

  const startTime = new Date().getTime();
  const response = await fetch(testUrl);
  const endTime = new Date().getTime();

  const duration = (endTime - startTime) / 1000;
  const contentLength = parseInt(response.headers.get('Content-Length'), 10);
  const bitsLoaded = contentLength * 8;
  const speedMbps = (bitsLoaded / duration) / 1000000;

  return speedMbps;
}
function updateTime() {
	fetch("http://worldtimeapi.org/api/ip")
		.then(response => response.json())
		.then(data => {
			const datetime = new Date(data.datetime);
			const hours = datetime.getHours();
			const minutes = datetime.getMinutes();
			const seconds = datetime.getSeconds();
			timeElement.innerHTML = `${hours}:${minutes}:${seconds}`;
		})
		.catch(error => {
			console.error(error);
			timeElement.innerHTML = "Error fetching time";
		});
}

setInterval(updateTime, 100);
