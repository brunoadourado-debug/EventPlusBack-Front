export interface TipoUsuario {
  idtipoUsuario: string;
  titulo?: string | null;
}

export interface Usuario {
  usuarioId: string;
  tipoUsuarioId?: string | null;
  email: string;
  senha: string;
  nome: string;
}

export interface StatusEvento {
  idtipoEvento: string;
  Status?: string | null;
}

export interface TipoEvento {
  idtipoEvento: string;
  titulo: string;
}

export interface Instituicao {
  idinstituicao: string;
  cnpj: string;
  nomeFantasia: string;
  endereco: string;
}

export interface Evento {
  eventoId: string;
  tipoEventoId?: string | null;
  instituicaoId?: string | null;
  dataEvento: Date | string;
  titulo: string;
  descricao: string;
  imagemUrl?: string | null;
  idStatusEvento?: string | null;
  tipoEvento: TipoEvento | null;
}

export interface Presenca {
  presencaId: string;
  usuarioId?: string | null;
  eventoId?: string | null;
  situacao?: boolean | null;
}

export interface Comentario {
  comentarioId: string;
  eventoId?: string | null;
  usuarioId?: string | null;
  comentarioUsuario: string;
  exibe?: boolean | null;
  dataComentario: Date | string;
}