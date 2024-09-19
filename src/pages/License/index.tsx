import {
  License,
  LicenseCreate,
  LicenseQuery,
  LicenseUpdate,
} from '@/api/models/license';
import { LicenseService } from '@/api/services/LicenseService';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  PageContainer,
  ProColumns,
  ProTable,
  TableDropdown,
} from '@ant-design/pro-components';
import { Button, Modal } from 'antd';
import dayjs from 'dayjs';
import { FC, useRef, useState } from 'react';
import CreateForm from './components/CreateForm';
import { useLicenseHook } from './hook';

const LicensePage: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [params, setParams] = useState<LicenseQuery>({
    page: 1,
    pageSize: 10,
  });
  const { data, isLoading, createLicense, onRefresh, updateLicense } =
    useLicenseHook(params);
  const [editData, setEditData] = useState<License>();
  const columns: ProColumns<License>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      copyable: true,
      ellipsis: true,
      tooltip: '标题过长会自动收缩',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      disable: true,
      title: '状态',
      dataIndex: 'status',
      filters: true,
      onFilter: true,
      ellipsis: true,
      valueType: 'select',
      valueEnum: {
        ACTIVE: {
          text: '激活',
          status: 'Success',
        },
        INACTIVE: {
          text: '未激活',
          status: 'Processing',
        },
        EXPIRED: {
          text: '过期',
          status: 'Error',
        },
      },
    },
    {
      title: '到期时间',
      key: 'expiresAt',
      dataIndex: 'expiresAt',
      valueType: 'date',
    },
    {
      title: '最大设备数',
      key: 'maxDevices',
      dataIndex: 'maxDevices',
      valueType: 'digit',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '创建时间',
      key: 'createdAt',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '更新时间',
      key: 'updatedAt',
      dataIndex: 'updatedAt',
      valueType: 'dateTime',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (_, record) => [
        <a
          key="editable"
          onClick={() => {
            setEditData(record);
            setIsOpen(true);
          }}
        >
          编辑
        </a>,
        <a target="_blank" rel="noopener noreferrer" key="view">
          查看
        </a>,
        <TableDropdown
          key="actionGroup"
          menus={[
            {
              key: 'delete',
              name: '删除',
              onClick: () => {
                Modal.confirm({
                  title: '确定删除该许可证吗？',
                  onOk: async () => {
                    await LicenseService.DeleteLicense(record.id);
                    onRefresh();
                  },
                });
              },
            },
            {
              key: 'activate',
              name: '激活',
              onClick: () => {
                Modal.confirm({
                  title: '确定激活该许可证吗？',
                  onOk: async () => {
                    // await LicenseService.DeleteLicense(record.id);
                    // onRefresh();
                  },
                });
              },
            },
            {
              key: 'deactivate',
              name: '禁用',
              onClick: () => {
                Modal.confirm({
                  title: '确定禁用该许可证吗？',
                  onOk: async () => {
                    // await LicenseService.DeleteLicense(record.id);
                    // onRefresh();
                  },
                });
              },
            },
          ]}
        />,
      ],
    },
  ];
  const actionRef = useRef<ActionType>();
  return (
    <PageContainer ghost>
      <ProTable<License>
        columns={columns}
        dataSource={data?.data}
        loading={isLoading}
        actionRef={actionRef}
        cardBordered
        onSubmit={(params) => {
          if (params.expiresAt) {
            const expiresAt = dayjs(params.expiresAt).startOf('day').valueOf();
            setParams((prev) => ({ ...prev, ...params, expiresAt }));
          }
        }}
        onReset={() => {
          setParams({
            page: 1,
            pageSize: 10,
          });
        }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
          defaultValue: {
            option: { fixed: 'right', disable: true },
          },
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        options={{
          reload: onRefresh,
          setting: {
            listsHeight: 400,
          },
        }}
        form={{
          syncToUrl: (values, type) => {
            if (type === 'get') {
              return {
                ...values,
                created_at: [values.startTime, values.endTime],
              };
            }
            return values;
          },
        }}
        pagination={{
          pageSize: data?.pageSize,
          current: data?.page,
          total: data?.total,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50, 100],
          onChange: (page, pageSize) => {
            setParams((prev) => ({ ...prev, page, pageSize }));
          },
        }}
        dateFormatter="string"
        headerTitle="高级表格"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              setIsOpen(true);
            }}
            type="primary"
          >
            新建
          </Button>,
        ]}
      />
      <CreateForm
        isOpen={isOpen}
        data={editData}
        onOpenChange={setIsOpen}
        onUpdate={async (license: LicenseUpdate) => {
          if (editData?.id) {
            await updateLicense({ licenseId: editData?.id, license });
          }
          setIsOpen(false);
          setEditData(undefined);
        }}
        onCreate={async (license: LicenseCreate) => {
          await createLicense({
            ...license,
            expiresAt: dayjs(license.expiresAt).startOf('day').valueOf(),
          });
          if (data?.page && data.page > 1) {
            setParams((prev) => ({ ...prev, page: 1 }));
          } else {
            onRefresh();
          }
          setIsOpen(false);
        }}
      />
    </PageContainer>
  );
};

export default LicensePage;
