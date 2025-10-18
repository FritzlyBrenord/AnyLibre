-- Table des conversations
CREATE TABLE conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Participants
    user1_id UUID REFERENCES users(id) ON DELETE CASCADE,
    user2_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Métadonnées
    title TEXT,
    conversation_type TEXT DEFAULT 'direct' CHECK (conversation_type IN ('direct', 'group', 'order')),
    
    -- Statut
    is_archived BOOLEAN DEFAULT FALSE,
    is_blocked BOOLEAN DEFAULT FALSE,
    is_spam BOOLEAN DEFAULT FALSE,
    is_starred BOOLEAN DEFAULT FALSE,
    
    -- Pour les conversations de commande
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    
    -- Contraintes
    UNIQUE(user1_id, user2_id)
);

-- Table des messages
CREATE TABLE messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Références
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reply_to_id UUID REFERENCES messages(id) ON DELETE SET NULL,
    
    -- Contenu
    content TEXT,
    message_type TEXT DEFAULT 'text' CHECK (message_type IN (
        'text', 'image', 'video', 'file', 'order', 'system', 'warning'
    )),
    
    -- Métadonnées du message
    is_read BOOLEAN DEFAULT FALSE,
    is_starred BOOLEAN DEFAULT FALSE,
    is_edited BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    
    -- Pour les fichiers
    file_url TEXT,
    file_name TEXT,
    file_size BIGINT,
    file_type TEXT,
    
    -- Pour les messages de commande
    order_details JSONB
);

-- Table des participants aux conversations de groupe
CREATE TABLE conversation_participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    role TEXT DEFAULT 'member' CHECK (role IN ('member', 'admin')),
    UNIQUE(conversation_id, user_id)
);

-- Index pour les performances
CREATE INDEX idx_conversations_user1 ON conversations(user1_id);
CREATE INDEX idx_conversations_user2 ON conversations(user2_id);
CREATE INDEX idx_conversations_updated ON conversations(updated_at DESC);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
CREATE INDEX idx_conversation_participants_user ON conversation_participants(user_id);

-- Policies RLS (Row Level Security)
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;

-- Policies pour conversations
CREATE POLICY "Users can view their conversations" ON conversations
    FOR SELECT USING (
        auth.uid() IN (user1_id, user2_id) OR
        EXISTS (
            SELECT 1 FROM conversation_participants 
            WHERE conversation_id = conversations.id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their conversations" ON conversations
    FOR INSERT WITH CHECK (auth.uid() IN (user1_id, user2_id));

CREATE POLICY "Users can update their conversations" ON conversations
    FOR UPDATE USING (auth.uid() IN (user1_id, user2_id));

-- Policies pour messages
CREATE POLICY "Users can view messages in their conversations" ON messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM conversations 
            WHERE id = messages.conversation_id AND 
                  (auth.uid() IN (user1_id, user2_id) OR
                   EXISTS (
                       SELECT 1 FROM conversation_participants 
                       WHERE conversation_id = conversations.id AND user_id = auth.uid()
                   ))
        )
    );

CREATE POLICY "Users can insert messages in their conversations" ON messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM conversations 
            WHERE id = messages.conversation_id AND 
                  (auth.uid() IN (user1_id, user2_id) OR
                   EXISTS (
                       SELECT 1 FROM conversation_participants 
                       WHERE conversation_id = conversations.id AND user_id = auth.uid()
                   ))
        )
    );

-- Policies pour participants
CREATE POLICY "Users can view conversation participants" ON conversation_participants
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM conversations 
            WHERE id = conversation_participants.conversation_id AND 
                  (auth.uid() IN (user1_id, user2_id) OR
                   EXISTS (
                       SELECT 1 FROM conversation_participants cp2
                       WHERE cp2.conversation_id = conversations.id AND cp2.user_id = auth.uid()
                   ))
        )
    );