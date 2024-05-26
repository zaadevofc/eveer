import { CompactTable } from '@table-library/react-table-library/compact';
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { Pagination } from 'rsuite';
import { useEffect, useState } from 'react';

const dataz = [
  {
    id: '0',
    name: 'Shopping List',
    deadline: new Date(2020, 1, 15),
    type: 'TASK',
    isComplete: true,
    nodes: 3,
  },
  {
    id: '0',
    name: 'Shopping List',
    deadline: new Date(2020, 1, 15),
    type: 'TASK',
    isComplete: true,
    nodes: 3,
  },
  {
    id: '0',
    name: 'Shopping List',
    deadline: new Date(2020, 1, 15),
    type: 'TASK',
    isComplete: true,
    nodes: 3,
  },
  {
    id: '0',
    name: 'Shopping List',
    deadline: new Date(2020, 1, 15),
    type: 'TASK',
    isComplete: true,
    nodes: 3,
  },
  {
    id: '0',
    name: 'Shopping List',
    deadline: new Date(2020, 1, 15),
    type: 'TASK',
    isComplete: true,
    nodes: 3,
  },
  {
    id: '0',
    name: 'Shopping List',
    deadline: new Date(2020, 1, 15),
    type: 'TASK',
    isComplete: true,
    nodes: 3,
  },
];

const columnz = [
  { label: 'Task', renderCell: (item) => item.name },
  {
    label: 'Deadline',
    renderCell: (item) =>
      item.deadline.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
  },
  { label: 'Type', renderCell: (item) => item.type },
  {
    label: 'Complete',
    renderCell: (item) => item.isComplete.toString(),
  },
  { label: 'Tasks', renderCell: (item) => item.nodes },
];

const Tables = ({ datas = [], columns = [], search = '' }) => {
  const [limit, setLimit] = useState(6);
  const [page, setPage] = useState(1);

  let column = columns.length ? columns : columnz;
  let data = datas.length ? datas : dataz;
  data = data.filter((v, i) => {
    const start = limit * (page - 1);
    const end = start + limit;
    return i >= start && i < end;
  })
  data = data.filter((item) => Object.values(item).join('').toLowerCase().includes(search.toLowerCase()))

  const theme = useTheme([getTheme(), {
    BaseRow: `font-size: 15px;`,
    Row: `font-size: 14px;`,
    BaseCell: `padding: 10px 12px;  &:not(:last-of-type) {border-right: 1px solid #f0f0f0;border-top: 1px solid #f0f0f0;}`,
    Table: `--data-table-library_grid-template-columns:  30% repeat(2, minmax(0, 1fr)) 25% 100px;`
  }]);

  const handleChangeLimit = z => {
    setPage(1);
    setLimit(z);
  };

  useEffect(() => {
    if (search.length > 0) {
      setLimit(data.length)
    } else {
      setLimit(6)
    }
    return () => null
  }, [search]);

  return (
    <>
      <div className='px-5 min-w-full overflow-x-scroll whitespace-nowrap'>
        <CompactTable theme={theme} columns={column} data={{ nodes: data }} />
        <div className='py-5 mt-5'>
          <Pagination
            prev
            next
            first
            last
            ellipsis
            boundaryLinks
            maxButtons={5}
            size="xs"
            layout={['total', 'limit', 'pager']}
            total={data.length}
            limitOptions={[6, 12, 24, 48, 100]}
            limit={limit}
            activePage={page}
            onChangePage={setPage}
            onChangeLimit={handleChangeLimit}
          />
        </div>
      </div>
    </>
  );
};

export default Tables