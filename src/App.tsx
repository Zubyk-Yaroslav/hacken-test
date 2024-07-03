import React, { useEffect, useState } from 'react';
import { Flex, Typography, Layout, Space, Table, Select, Image } from 'antd';
import { ColumnsType, TablePaginationConfig, TableProps } from 'antd/es/table';
import { useAppDispatch, useAppSelector } from './app/hooks';
import {
  coinsState,
  getCoinsOptionally,
  setCoins,
} from './features/coins/coins';

const { Title } = Typography;

enum Currency {
  USD = 'USD',
  EUR = 'EUR',
}

enum Order {
  DESC = 'Market cap descending',
  ASC = 'Market cap ascending',
}

enum OrderRequest {
  DESC = 'market_cap_desc',
  ASC = 'market_cap_asc',
}

const layoutStyle = {
  borderRadius: 8,
  gap: 24,
  overflow: 'hidden',
  width: 'calc(100% - 8px)',
  maxWidth: 'calc(100% - 8px)',
  backgroundColor: '#fff',
};

interface DataType {
  key: string;
  image: string;
  name: string;
  current_price: number;
  circulating_supply: number;
}

interface TableParams {
  pagination?: TablePaginationConfig;
}

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { coins, loaded, hasError } = useAppSelector(coinsState);
  const [currency, setCurrency] = useState(Currency.USD);
  const [marketCap, setMarketCap] = useState(Order.DESC);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      total: 10000,
    },
  });

  const handleCurrencyChange = (value: Currency) => {
    setCurrency(value);
  };

  const handleMarketMapChange = (value: Order) => {
    setMarketCap(value);
  };

  useEffect(() => {
    dispatch(
      getCoinsOptionally({
        currency: currency.toLowerCase(),
        order: marketCap,
        perPage: tableParams.pagination?.pageSize ?? 10,
        page: tableParams.pagination?.current ?? 1,
      })
    );
  }, [currency, dispatch, marketCap, tableParams.pagination]);

  const columns: ColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text: string, record: DataType) => (
        <Space style={{ gap: 24 }}>
          <Image
            width={32}
            src={record.image}
            placeholder={
              <Image
                preview={false}
                src='record.image'
                width={200}
              />
            }
          />
          {text}
        </Space>
      ),
      width: '50%',
    },
    {
      title: 'Current Price',
      dataIndex: 'current_price',
      render: (current_price) => `${current_price} ${currency.toLowerCase()}`,
      width: '25%',
    },
    {
      title: 'Circulating Supply',
      dataIndex: 'circulating_supply',
    },
  ];

  const handleTableChange: TableProps['onChange'] = (pagination) => {
    setTableParams({
      pagination,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      dispatch(setCoins);
    }
  };

  return (
    <>
      <Flex
        gap='middle'
        wrap
      >
        <Layout style={layoutStyle}>
          <Title level={3}>Coins & Markets</Title>
          {!hasError && (
            <>
              <Space wrap>
                <Select
                  value={currency}
                  defaultValue={Currency.USD}
                  style={{ width: 200 }}
                  onChange={handleCurrencyChange}
                  options={[
                    { value: Currency.USD, label: Currency.USD },
                    { value: Currency.EUR, label: Currency.EUR },
                  ]}
                />
                <Select
                  value={marketCap}
                  defaultValue={Order.DESC}
                  style={{ width: 200 }}
                  onChange={handleMarketMapChange}
                  options={[
                    {
                      value: OrderRequest.DESC,
                      label: Order.DESC,
                    },
                    {
                      value: OrderRequest.ASC,
                      label: Order.ASC,
                    },
                  ]}
                />
              </Space>
              <Table
                columns={columns}
                dataSource={coins}
                pagination={tableParams.pagination}
                loading={loaded}
                onChange={handleTableChange}
              />
            </>
          )}
          {hasError && (
            <p>Too many requests, please reload the page in 2 minutes...</p>
          )}
        </Layout>
      </Flex>
    </>
  );
};

export default App;
