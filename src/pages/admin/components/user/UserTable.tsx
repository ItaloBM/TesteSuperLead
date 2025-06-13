
import { User } from "../../types";
import { PenSquare, Trash2 } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface UserTableProps {
  users: User[];
  handleEditUser: (user: User) => void;
  openDeleteDialog: (userId: string) => void;
}

const UserTable = ({ users, handleEditUser, openDeleteDialog }: UserTableProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatLastOnline = (isOnline: string | null) => {
    if (!isOnline) return "Nunca";
    return new Date(isOnline).toLocaleDateString('pt-BR');
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>NOME</TableHead>
          <TableHead>CPF/CNPJ</TableHead>
          <TableHead>EMAIL</TableHead>
          <TableHead>TELEFONE</TableHead>
          <TableHead>PLANO</TableHead>
          <TableHead>STATUS</TableHead>
          <TableHead>ADMIN</TableHead>
          <TableHead>ÚLTIMO ACESSO</TableHead>
          <TableHead>DATA DE CRIAÇÃO</TableHead>
          <TableHead>AÇÕES</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length > 0 ? (
          users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.cpfOrCnpj}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.plan === "PRO"
                      ? "bg-primary/10 text-primary"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {user.plan}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.activeAccount
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.activeAccount ? "Ativo" : "Inativo"}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.isAdmin
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {user.isAdmin ? "Admin" : "Usuário"}
                </span>
              </TableCell>
              <TableCell>{formatLastOnline(user.isOnline)}</TableCell>
              <TableCell>{formatDate(user.createdAt)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <button 
                    className="p-1 hover:text-primary transition-colors"
                    onClick={() => handleEditUser(user)}
                  >
                    <PenSquare className="h-4 w-4" />
                  </button>
                  <button 
                    className="p-1 hover:text-red-600 transition-colors"
                    onClick={() => openDeleteDialog(user.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={10} className="text-center py-4 text-gray-500">
              Nenhum usuário encontrado
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default UserTable;
