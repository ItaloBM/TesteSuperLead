
import { Spinner } from "@/components/ui/spinner";
import UserSection from "./UserSection";
import LeadSection from "./LeadSection";
import DomainSection from "./DomainSection";
import PlanSection from "./PlanSection";
import EmailTemplateSection from "./EmailTemplateSection";
import { User, Lead } from "../types";

interface AdminContentProps {
  currentView: string;
  users: User[];
  isUsersLoading: boolean;
  currentPage: number;
  totalPages: number;
  leads: Lead[];
  isLeadsLoading: boolean;
  leadCurrentPage: number;
  leadTotalPages: number;
  handleEditUser: (user: User) => void;
  openDeleteDialog: (userId: string) => void;
  handleOpenNewUserDialog: () => void;
  handlePageChange: (page: number) => void;
  loadUsers: (page?: number, quantityRegisters?: number) => void;
  handleEditLead: (lead: Lead) => void;
  openDeleteLeadDialog: (leadId: string) => void;
  handleLeadPageChange: (page: number) => void;
  loadLeads: (page?: number, quantityRegisters?: number) => void;
  hasLoadedInitially: boolean;
}

const AdminContent = ({
  currentView,
  users,
  isUsersLoading,
  currentPage,
  totalPages,
  leads,
  isLeadsLoading,
  leadCurrentPage,
  leadTotalPages,
  handleEditUser,
  openDeleteDialog,
  handleOpenNewUserDialog,
  handlePageChange,
  loadUsers,
  handleEditLead,
  openDeleteLeadDialog,
  handleLeadPageChange,
  loadLeads,
  hasLoadedInitially
}: AdminContentProps) => {
  switch (currentView) {
    case "users":
      return isUsersLoading && !hasLoadedInitially ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : (
        <UserSection
          users={users}
          isUsersLoading={isUsersLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          handleEditUser={handleEditUser}
          openDeleteDialog={openDeleteDialog}
          handleOpenNewUserDialog={handleOpenNewUserDialog}
          handlePageChange={handlePageChange}
          loadUsers={loadUsers}
          hasLoadedInitially={hasLoadedInitially}
        />
      );
      
    case "leads":
      return isLeadsLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : (
        <LeadSection
          leads={leads}
          handleEditLead={handleEditLead}
          openDeleteLeadDialog={openDeleteLeadDialog}
          ITEMS_PER_PAGE={50}
        />
      );
      
    case "cors":
      return (
        <DomainSection
          ITEMS_PER_PAGE={50}
        />
      );
      
    case "plans":
      return (
        <PlanSection
          ITEMS_PER_PAGE={50}
        />
      );
      
    case "emailTemplates":
      return (
        <EmailTemplateSection
          ITEMS_PER_PAGE={50}
        />
      );
      
    default:
      return null;
  }
};

export default AdminContent;
