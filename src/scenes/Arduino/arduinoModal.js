import React from 'react'
import { Modal, Form, Input } from 'antd';
import { Component } from 'react';

const FormItem = Form.Item;

const ArduinoForm = Form.create()(
  class extends Component {
    componentWillMount() {
      this.setState({
        loading: false
      })
    }

    render() {
      const { visible, onCancel, onCreate, form, titleText, okText } = this.props;
      const { getFieldDecorator } = form;

      return (
        <div>
        <Modal
          visible={visible}
          title={titleText}
          okText={okText}
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <div>
              <FormItem>
                {getFieldDecorator('id', {}) (
                  <Input hidden={true} type='hidden'/>
                )}
              </FormItem>

              <FormItem label='Nome'>
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: 'Por favor insira o nome.' }],
                })(
                  <Input required={true} type='text' />
                )}
              </FormItem>

              <FormItem label='Local'>
                {getFieldDecorator('location', {
                  rules: [{ required: true, message: 'Por favor insira o local.' }],
                })(
                  <Input required={true} type='text' />
                )}
              </FormItem>
            </div>
          </Form>
        </Modal>
        </div>
      );
    }
  }
)

export default ArduinoForm;