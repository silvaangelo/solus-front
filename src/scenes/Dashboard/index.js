import React from 'react';
import TopMenu from '../menu';
import { Layout, Row, Col, Divider, Select, Form, InputNumber, DatePicker, Button } from 'antd';
import * as axios from 'axios';
import { API_ROUTES, API_HEADERS } from '../../api';
import { notifyWithIcon } from '../helpers/notification'
import moment from 'moment';
import { LineChart, CartesianGrid, Tooltip, Line, XAxis, YAxis, Legend, ResponsiveContainer } from 'recharts';
import './style.css';

class Dashboard extends React.Component {
  chartRef;

  constructor(props) {
    super(props);

    document.title = 'Solus | Dashboard';

    this.chartRef = React.createRef();

    this.state = {
      loading: true,
      loadingStatistic: false,
      isStatisticLoaded: false,
      arduinos: [],
      data: []
    };
  }

  getArduinos = async (e) => {
    try {
      const res = await axios.get(API_ROUTES.arduino, API_HEADERS);

      return res.data.data.map(arduino => {
        arduino.key = arduino._id;
        arduino.id = arduino._id;

        return arduino;
      });
    } catch (e) {
      notifyWithIcon('error', 'Ocorreu um ero ao carregar os arduinos.');
    }
  }

  getStatistic = async (values) => {
    try {
      const res = await axios.get(`${API_ROUTES.statistic}/${values.arduino}`, {
        params: {
          from: values.range[0].format('YYYY-MM-DD HH:mm'),
          to: values.range[1].format('YYYY-MM-DD HH:mm'),
          interval: `${values.intervalValue}${values.intervalGrandeur}`
        },
        headers: API_HEADERS.headers
      });

      return await res.data.data.statistic.map(e => {
        e.date = moment(e._id).local().format('HH:mm DD/MM/YYYY');
        e.ambienceTemperature = parseInt(e.ambienceTemperature);
        e.rainfall = parseInt(e.rainfall);
        e.sunCapability = parseInt(e.sunCapability);
        e.humidity = parseInt(e.humidity);
        e.temperatureHumidity = parseInt(e.temperatureHumidity);
        e.lightIntensity = parseInt(e.lightIntensity);

        return e;
      });
    } catch (e) {
      notifyWithIcon('error', 'Ocorreu um ero ao carregar as estatísticas, por favor, tente novamente mais tarde.');
    }
  }

  loadStatistic = async (e) => {
    e.preventDefault();
    this.setState({
      loadingStatistic: true
    });

    this.props.form.validateFields(async (err, values) => {
      if(err) {
        return;
      }

      const data = await this.getStatistic(values);

      this.setState({
        data: data.reverse(),
        isStatisticLoaded: true,
        loadingStatistic: false
      });
    });
  }
  
  async componentWillMount() {
    this.setState({
      loading: false,
      arduinos: await this.getArduinos()
    });
  }

  charts = () => {
    if(!this.state.isStatisticLoaded && this.state.data.length <= 0) {
      return (null);
    }

    return (
      <div>
        <Divider/>
    
        <Row>
          <Col span={24}>
            <h2>Resultados:</h2>
          </Col>
        </Row>

        <Divider/>

        <Row>
          <Col span={24}>
            <h3>Gráficos:</h3>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <ResponsiveContainer width="100%" height={350} ref={this.chartRef}>
              <LineChart data={this.state.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line name="Temperatura" type="monotone" dataKey="ambienceTemperature" stroke="#d11141" />
                <Line name="Chuva" type="monotone" dataKey="rainfall" stroke="#00a119" />
                <Line name="Incidência Solar" type="monotone" dataKey="sunCapability" stroke="#00aedb" />
                <Line name="Umidade" type="monotone" dataKey="humidity" stroke="#f37735" />
                <Line name="Temperatura a umidade" type="monotone" dataKey="temperatureHumidity" stroke="#ffc425" />
                <Line name="Intensidade de luz" type="monotone" dataKey="lightIntensity" stroke="#9a12c7" />
              </LineChart>
            </ResponsiveContainer>
          </Col>
        </Row>
      </div>
    );
  }

  render () {
    const { getFieldDecorator } = this.props.form;
    const { RangePicker } = DatePicker;

    const Charts = this.charts;

    return (
      <div>
        <TopMenu></TopMenu>

        <div id={"root-with-header"}>
          <Layout className="no-background">
            <Row>
              <Col span={24}>
                <h1>Dashboard</h1>
                <Divider/>
              </Col>
            </Row>

            <Row>
              <Col span={24}>
                <h2>Filtros:</h2>
              </Col>
            </Row>

            <Row>
              <Form onSubmit={this.loadStatistic}>
                <Row>
                  <Col xs={24} lg={7} sm={7} md={7}>
                    <Form.Item>
                      {getFieldDecorator('arduino', {
                        rules: [{ required: true, message: 'Por favor escolha o arduino.' }]
                      }) (
                        <Select placeholder="Arduino">
                          {this.state.arduinos.map(e => {
                            return (<Select.Option key={e.id} value={e.id}>{e.name}</Select.Option>);
                          })}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>

                <Row>
                  <Col xs={24} lg={24} sm={24} md={24}>
                    <Form.Item style={{maxWidth: "100%"}}>
                      {getFieldDecorator('range', {
                        rules: [{ required: true, message: 'Por favor escolha a data inicial e a data limite.' }]
                      }) (
                        <RangePicker placeholder={["De", "Até"]} showTime format="YYYY-MM-DD HH:mm:ss" required />
                      )}
                    </Form.Item>
                  </Col>
                </Row>

                <Row>
                  <Col xs={7} lg={2} sm={2} md={2}>
                    <Form.Item>
                      {getFieldDecorator('intervalValue', {
                        rules: [{ required: true, message: 'Por favor escolha o intervalo.' }]
                      }) (
                        <InputNumber min={1} placeholder="Intervalo" />
                      )}
                    </Form.Item>
                  </Col>

                  <Col xs={17} lg={2} sm={2} md={2}>
                    <Form.Item>
                      {getFieldDecorator('intervalGrandeur', {
                        rules: [{ required: true, message: 'Por favor escolha a grandeza de intervalo.' }]
                      }) (
                        <Select placeholder="Grandeza">
                          <Select.Option value='d'>Dia</Select.Option>
                          <Select.Option value='m'>Mês</Select.Option>
                          <Select.Option value='y'>Ano</Select.Option>
                          <Select.Option value='h'>Hora</Select.Option>
                          <Select.Option value='i'>Minuto</Select.Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                
                <Form.Item>
                  <Button type="primary" loading={this.state.loadingStatistic} htmlType="submit">Buscar</Button>
                </Form.Item>
              </Form>
            </Row>

            <Charts />
          </Layout>
        </div>
      </div>
    )
  }
}

const FormDashboard = Form.create()(Dashboard);

export default FormDashboard