import { AdminLayout } from "@/components/AdminLayout";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      flowerId: Number(context.query.flowerId),
    },
  };
};

const InventoryDetail = ({ flowerId }: { flowerId: number }) => {
  return <AdminLayout>在庫詳細</AdminLayout>;
};

export default InventoryDetail;
