
import { useEmailTemplateHandlers } from "../hooks/useEmailTemplateHandlers";

// Components
import EmailTemplateHeader from "./emailTemplate/EmailTemplateHeader";
import EmailTemplateSearch from "./emailTemplate/EmailTemplateSearch";
import EmailTemplateTable from "./emailTemplate/EmailTemplateTable";
import EmailTemplatePagination from "./emailTemplate/EmailTemplatePagination";
import EmailTemplateDialogs from "./emailTemplate/EmailTemplateDialogs";

interface EmailTemplateSectionProps {
  ITEMS_PER_PAGE: number;
}

const EmailTemplateSection = ({ ITEMS_PER_PAGE }: EmailTemplateSectionProps) => {
  const {
    // State
    searchTerm,
    setSearchTerm,
    currentPage,
    isLoading,
    templates,
    totalPages,
    
    // View dialog
    templateToView,
    isViewDialogOpen,
    setIsViewDialogOpen,
    
    // New template dialog
    isNewTemplateDialogOpen,
    setIsNewTemplateDialogOpen,
    
    // Edit dialog
    templateToEdit,
    isEditDialogOpen,
    setIsEditDialogOpen,
    
    // Delete dialog
    templateToDelete,
    setTemplateToDelete,
    
    // Handlers
    handlePageChange,
    handleViewTemplate,
    openNewTemplateDialog,
    handleCreateTemplate,
    handleEditTemplate,
    handleUpdateTemplate,
    openDeleteTemplateDialog,
    handleDeleteTemplate
  } = useEmailTemplateHandlers(ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col space-y-6">
      <EmailTemplateHeader openNewTemplateDialog={openNewTemplateDialog} />
      <EmailTemplateSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <div className="bg-white rounded-xl shadow-sm border">
        {isLoading ? (
          <div className="p-10 text-center">Carregando templates...</div>
        ) : (
          <EmailTemplateTable
            templates={templates}
            handleViewTemplate={handleViewTemplate}
            handleEditTemplate={handleEditTemplate}
            openDeleteTemplateDialog={openDeleteTemplateDialog}
          />
        )}
        
        {templates.length > 0 && (
          <EmailTemplatePagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        )}
      </div>
      
      <EmailTemplateDialogs
        // View Dialog
        isViewDialogOpen={isViewDialogOpen}
        setIsViewDialogOpen={setIsViewDialogOpen}
        templateToView={templateToView}
        
        // New Template Dialog
        isNewTemplateDialogOpen={isNewTemplateDialogOpen}
        setIsNewTemplateDialogOpen={setIsNewTemplateDialogOpen}
        handleCreateTemplate={handleCreateTemplate}
        
        // Edit Dialog
        templateToEdit={templateToEdit}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        handleUpdateTemplate={handleUpdateTemplate}
        
        // Delete Dialog
        templateToDelete={templateToDelete}
        setTemplateToDelete={setTemplateToDelete}
        handleDeleteTemplate={handleDeleteTemplate}
      />
    </div>
  );
};

export default EmailTemplateSection;
