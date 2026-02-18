import { PageContainer } from "@/components/layout/PageContainer";
import CategoriesPage from "./categories/CategoriesPage";
import InstructorsPage from "./instructors/InstructorsPage";
import BannersPage from "./banners/BannersPage";
import CouponsPage from "./coupons/CouponsPage";

export { CategoriesPage, InstructorsPage, BannersPage, CouponsPage };
export const StudentsPage = () => <PageContainer title="Students" description="View and manage enrolled students." />;
export const OrdersPage = () => <PageContainer title="Orders" description="Track sales and transaction history." />;
export const ReviewsPage = () => <PageContainer title="Reviews" description="Monitor student feedback and ratings." />;
