import React from 'react'
import { Modal, Form, Input, Button } from 'antd';
import { Component } from 'react';

const FormItem = Form.Item;

const UserForm = Form.create()(
  class extends Component {
    componentWillMount() {
      this.setState({
        loading: false,
        isPasswordRequired: true
      });
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
            footer={[
              <Button key="back" onClick={onCancel}>Cancelar</Button>,
              <Button key="submit" type="primary" loading={this.state.loading} onClick={onCreate}>
                Salvar
              </Button>,
            ]}
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
                  }) (
                    <Input type='text' />
                  )}
                </FormItem>

                <FormItem label='E-mail'>
                  {getFieldDecorator('email', {
                    rules: [{ required: true, message: 'Por favor insira o email.' }],
                  })(
                    <Input required={true} type='email' />
                  )}
                </FormItem>

                <FormItem label='Senha'>
                  {getFieldDecorator('password', {
                    rules: [{ required: this.state.isPasswordRequired, message: 'Por favor insira a senha.' }],
                  })(
                    <Input required={this.state.isPasswordRequired} minLength={8} maxLength={16} type='password' />
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

export default UserForm;