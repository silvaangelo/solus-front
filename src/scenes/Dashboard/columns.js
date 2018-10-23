const columns = [{
  key: "ambienceTemperature",
  text: "Temperatura",
  show: v => `${v}°C`,
  color: "#d11141"
},
{
  key: "rainfall",
  text: "Chuva",
  show: v => `${v}%`,
  color: "#00a119"
},
{
  key: "sunCapability",
  text: "Incidência Solar",
  show: v => `${v}`,
  color: "#00aedb"
},
{
  key: "humidity",
  text: "Umidade",
  show: v => `${v}%`,
  color: "#f37735"
},
{
  key: "temperatureHumidity",
  text: "Temperatura a umidade",
  show: v => `${v}°C`,
  color: "#ffc425"
},
{
  key: "lightIntensity",
  text: "Intensidade de luz",
  show: v => v,
  color: "#9a12c7"
}];

export default columns;