import {
  License,
  LicenseCreate,
  LicenseQuery,
  LicenseUpdate,
} from '@/api/models/license';
import { Page } from '@/api/models/page';
import { LicenseService } from '@/api/services/LicenseService';
import { useMutation, useQuery, useQueryClient } from '@umijs/max';
import { message } from 'antd';
import { useCallback } from 'react';

export const useLicenseHook = (query: LicenseQuery) => {
  const queryKey = [
    'license',
    query.page,
    query.pageSize,
    query.email,
    query.status,
    query.status,
    query.expiresAt,
  ];
  const queryClient = useQueryClient();
  const { data, isFetching: isLoading } = useQuery({
    queryKey: queryKey,
    queryFn: () => LicenseService.ListLicense(query),
  });
  const onRefresh = useCallback(() => {
    queryClient.invalidateQueries(queryKey);
  }, [queryClient, queryKey]);
  // 添加
  const { mutateAsync: createLicense, isLoading: isCreateLoading } =
    useMutation(
      (license: LicenseCreate) => LicenseService.CreateLicense(license),
      {
        onSuccess() {
          message.success('创建成功');
        },
      },
    );

  // 编辑
  const { mutateAsync: updateLicense, isLoading: isUpdateLoading } =
    useMutation(
      (params: { licenseId: string; license: LicenseUpdate }) =>
        LicenseService.UpdateLicense(params.licenseId, params.license),
      {
        onMutate: async ({ licenseId, license }) => {
          await queryClient.cancelQueries(queryKey);
          const previousLicenses =
            queryClient.getQueryData<Page<License>>(queryKey);
          queryClient.setQueryData<Page<License>>(
            queryKey,
            (
              oldLicenses: Page<License> = {
                data: [],
                total: 0,
                totalPage: 0,
                page: 0,
                pageSize: 0,
              },
            ) =>
              ({
                ...oldLicenses,
                data: oldLicenses.data.map((l) =>
                  l.id === licenseId ? { ...l, ...license } : l,
                ),
              } as Page<License>),
          );
          return { previousLicenses };
        },
        onSuccess() {
          message.success('修改成功');
        },

        onError: (_error, _variables, context) => {
          if (context?.previousLicenses) {
            queryClient.setQueryData(queryKey, context.previousLicenses);
          }
        },
      },
    );

  // 删除
  const { mutateAsync: deleteLicense } = useMutation(
    (licenseId: string) => LicenseService.DeleteLicense(licenseId),
    {
      onSuccess() {
        message.success('删除成功');
      },
    },
  );
  return {
    data,
    isLoading,
    createLicense,
    updateLicense,
    isCreateLoading,
    deleteLicense,
    isUpdateLoading,
    onRefresh,
  };
};
