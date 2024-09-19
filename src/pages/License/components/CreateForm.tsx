import { License, LicenseCreate, LicenseUpdate } from '@/api/models/license';
import {
  ModalForm,
  ProFormDatePicker,
  ProFormDigit,
  ProFormText,
} from '@ant-design/pro-components';
import { Form } from 'antd';
import React, { PropsWithChildren, useEffect } from 'react';

interface CreateFormProps {
  isOpen: boolean;
  onOpenChange: (b: boolean) => void;
  onUpdate: (value: LicenseUpdate) => Promise<void>;
  data?: License;
  onCreate: (value: LicenseCreate) => Promise<void>;
}

const CreateForm: React.FC<PropsWithChildren<CreateFormProps>> = (props) => {
  const { isOpen, onOpenChange, onCreate, data, onUpdate } = props;
  const [form] = Form.useForm();
  useEffect(() => {
    if (!isOpen) {
      form.resetFields();
    }
  }, [isOpen]);
  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    }
  }, [data]);
  return (
    <ModalForm
      title={data ? '更新许可证' : '创建许可证'}
      form={form}
      width="400px"
      open={isOpen}
      onOpenChange={onOpenChange}
      onFinish={async (value) => {
        if (data) {
          await onUpdate(value as LicenseUpdate);
        } else {
          await onCreate(value as LicenseCreate);
        }
      }}
    >
      {data ? <ProFormText label="Key" disabled name="key" /> : null}
      <ProFormText
        label="许可证邮箱"
        rules={[
          {
            required: true,
            message: '请输入许可证邮箱',
          },
          {
            type: 'email',
            message: '请输入有效的邮箱地址',
          },
        ]}
        name="email"
      />
      <div className="flex justify-between">
        <ProFormDigit
          label="许可证设备数量"
          className="flex-1"
          rules={[{ required: true, message: '请输入许可证设备数量' }]}
          min={1}
          initialValue={1}
          name="maxDevices"
        />
        <ProFormDatePicker
          label="许可证到期时间"
          rules={[{ required: true, message: '请选择许可证到期时间' }]}
          name="expiresAt"
        />
      </div>
    </ModalForm>
  );
};

export default CreateForm;
