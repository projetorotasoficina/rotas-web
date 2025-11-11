import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/services/api";
import type { User } from "@/contexts/auth-context";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";
import { removePhoneMask } from "@/lib/masks";

interface UpdateMeData {
  nome: string;
  telefone?: string | null;
  cpf?: string | null;
}

async function updateMe(data: UpdateMeData): Promise<User> {
  console.log("Data sent to server:", data);
  const response = await fetchWithAuth("/usuarios/meu-perfil", {
    method: "PUT",
    body: JSON.stringify(data),
  });
  const responseData = await response.json();
  console.log("Data received from server:", responseData);
  return responseData;
}

export function useUpdateMe() {
  const queryClient = useQueryClient();
  const { login, user, token } = useAuth();

  return useMutation({
    mutationFn: updateMe,
    onSuccess: (data, variables) => {
      const hasChanged =
        user?.nome !== variables.nome ||
        (user?.telefone ? removePhoneMask(user.telefone) : null) !==
          (variables.telefone ? removePhoneMask(variables.telefone) : null) ||
        user?.cpf !== variables.cpf;

      if (!hasChanged) {
        toast.info("Nenhuma alteração foi feita.");
        return;
      }

      queryClient.setQueryData(["me"], data);
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      if (user && token) {
        login(token, {
          ...user,
          nome: variables.nome,
          telefone: variables.telefone ?? null,
          cpf: variables.cpf ?? null,
        });
      }
      toast.success("Usuário atualizado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao atualizar usuário.");
    },
  });
}
