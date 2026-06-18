import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Check, Trash2, Send, ChevronDown, ChevronUp,
  AlertCircle, X
} from 'lucide-react';

export interface LeaseComment {
  id: string;
  clauseIndex: number;
  clauseLabel: string;
  author: 'seeker' | 'agent';
  authorName: string;
  text: string;
  timestamp: Date;
  resolved: boolean;
  replies: LeaseReply[];
}

interface LeaseReply {
  id: string;
  author: 'seeker' | 'agent';
  authorName: string;
  text: string;
  timestamp: Date;
}

interface CommentPopoverProps {
  clauseIndex: number;
  clauseLabel: string;
  position: { top: number; left: number };
  onSubmit: (clauseIndex: number, clauseLabel: string, text: string) => void;
  onClose: () => void;
}

export const CommentPopover: React.FC<CommentPopoverProps> = ({
  clauseIndex, clauseLabel, position, onSubmit, onClose,
}) => {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSubmit(clauseIndex, clauseLabel, text.trim());
    setText('');
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 4, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.96 }}
      className="absolute z-30 w-72 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden"
      style={{ top: position.top, left: position.left }}
      onClick={e => e.stopPropagation()}
    >
      <div className="px-3.5 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Comment on Clause {clauseIndex}
        </p>
        <button onClick={onClose} className="w-5 h-5 rounded-full hover:bg-slate-200 flex items-center justify-center">
          <X className="w-3 h-3 text-slate-400" />
        </button>
      </div>
      <div className="p-3">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Add your comment or concern…"
          className="w-full h-20 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30 placeholder:text-slate-300"
          autoFocus
        />
        <button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="mt-2 w-full h-8 bg-primary text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-all"
        >
          <Send className="w-3 h-3" /> Post Comment
        </button>
      </div>
    </motion.div>
  );
};

/* ── Floating "Add Comment" tooltip on clause hover ── */
interface ClauseCommentTriggerProps {
  onClick: () => void;
  hasComments: boolean;
  unresolvedCount: number;
}

export const ClauseCommentTrigger: React.FC<ClauseCommentTriggerProps> = ({
  onClick, hasComments, unresolvedCount,
}) => (
  <button
    onClick={e => { e.stopPropagation(); onClick(); }}
    className={`shrink-0 ml-2 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
      hasComments
        ? unresolvedCount > 0
          ? 'bg-primary/10 text-primary'
          : 'bg-[hsl(var(--escrow-green))]/10 text-[hsl(var(--escrow-green))]'
        : 'opacity-0 group-hover:opacity-100 bg-slate-100 text-slate-400 hover:bg-primary/10 hover:text-primary'
    }`}
    title={hasComments ? `${unresolvedCount} unresolved` : 'Add comment'}
  >
    {hasComments ? (
      unresolvedCount > 0 ? (
        <span className="text-[9px] font-black">{unresolvedCount}</span>
      ) : (
        <Check className="w-3 h-3" />
      )
    ) : (
      <MessageSquare className="w-3 h-3" />
    )}
  </button>
);

/* ── Sidebar Comments Panel ── */
interface CommentsPanelProps {
  comments: LeaseComment[];
  onResolve: (commentId: string) => void;
  onDelete: (commentId: string) => void;
  onReply: (commentId: string, text: string) => void;
  currentUser: 'seeker' | 'agent';
}

export const CommentsPanel: React.FC<CommentsPanelProps> = ({
  comments, onResolve, onDelete, onReply, currentUser,
}) => {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [collapsedResolved, setCollapsedResolved] = useState(true);

  const openComments = comments.filter(c => !c.resolved);
  const resolvedComments = comments.filter(c => c.resolved);

  const handleReply = (commentId: string) => {
    if (!replyText.trim()) return;
    onReply(commentId, replyText.trim());
    setReplyText('');
    setReplyingTo(null);
  };

  const formatTime = (d: Date) => {
    const mins = Math.floor((Date.now() - d.getTime()) / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ago`;
  };

  const renderComment = (comment: LeaseComment) => (
    <motion.div
      key={comment.id}
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      className={`p-3.5 rounded-xl border transition-colors ${
        comment.resolved
          ? 'bg-[hsl(var(--escrow-green))]/5 border-[hsl(var(--escrow-green))]/15'
          : 'bg-white border-slate-200'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black text-white ${
            comment.author === 'seeker' ? 'bg-primary' : 'bg-[hsl(var(--navy))]'
          }`}>
            {comment.authorName.charAt(0)}
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-700">{comment.authorName}</p>
            <p className="text-[9px] text-slate-400 font-medium">{formatTime(comment.timestamp)}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {!comment.resolved && (
            <button
              onClick={() => onResolve(comment.id)}
              className="w-6 h-6 rounded-lg bg-[hsl(var(--escrow-green))]/10 text-[hsl(var(--escrow-green))] hover:bg-[hsl(var(--escrow-green))]/20 flex items-center justify-center transition-colors"
              title="Resolve"
            >
              <Check className="w-3 h-3" />
            </button>
          )}
          {comment.author === currentUser && (
            <button
              onClick={() => onDelete(comment.id)}
              className="w-6 h-6 rounded-lg hover:bg-destructive/10 text-slate-300 hover:text-destructive flex items-center justify-center transition-colors"
              title="Delete"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Clause ref */}
      <p className="text-[9px] font-bold text-primary/60 uppercase tracking-wider mb-1">
        Clause {comment.clauseIndex}: {comment.clauseLabel}
      </p>
      <p className="text-xs text-slate-600 font-medium leading-relaxed">{comment.text}</p>

      {/* Replies */}
      {comment.replies.length > 0 && (
        <div className="mt-2.5 space-y-2 pl-3 border-l-2 border-slate-100">
          {comment.replies.map(reply => (
            <div key={reply.id} className="flex items-start gap-2">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black text-white shrink-0 ${
                reply.author === 'seeker' ? 'bg-primary' : 'bg-[hsl(var(--navy))]'
              }`}>
                {reply.authorName.charAt(0)}
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-600">{reply.authorName} <span className="font-normal text-slate-400">{formatTime(reply.timestamp)}</span></p>
                <p className="text-[11px] text-slate-500 font-medium">{reply.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply input */}
      {!comment.resolved && (
        replyingTo === comment.id ? (
          <div className="mt-2.5 flex gap-1.5">
            <input
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder="Reply…"
              className="flex-1 h-7 text-[11px] bg-slate-50 border border-slate-200 rounded-lg px-2.5 focus:outline-none focus:ring-1 focus:ring-primary/20"
              autoFocus
              onKeyDown={e => e.key === 'Enter' && handleReply(comment.id)}
            />
            <button
              onClick={() => handleReply(comment.id)}
              disabled={!replyText.trim()}
              className="w-7 h-7 bg-primary text-white rounded-lg flex items-center justify-center disabled:opacity-40"
            >
              <Send className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setReplyingTo(comment.id)}
            className="mt-2 text-[10px] font-bold text-primary/60 hover:text-primary transition-colors"
          >
            Reply
          </button>
        )
      )}
    </motion.div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-1">
          <MessageSquare className="w-4 h-4 text-primary" />
          <h3 className="text-slate-900 font-black text-sm">Negotiation</h3>
        </div>
        {openComments.length > 0 ? (
          <div className="flex items-center gap-1.5 mt-1">
            <AlertCircle className="w-3 h-3 text-[hsl(var(--escrow-amber))]" />
            <p className="text-[hsl(var(--escrow-amber))] text-[10px] font-bold">
              {openComments.length} Open Request{openComments.length !== 1 ? 's' : ''} from Seeker
            </p>
          </div>
        ) : (
          <p className="text-[hsl(var(--escrow-green))] text-[10px] font-bold mt-1 flex items-center gap-1">
            <Check className="w-3 h-3" /> All comments resolved
          </p>
        )}
        <p className="text-slate-400 text-[9px] font-medium mt-2 leading-relaxed">
          Resolving a comment indicates you've updated the lease or reached an agreement on this clause.
        </p>
      </div>

      {/* Open comments */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        <AnimatePresence>
          {openComments.map(renderComment)}
        </AnimatePresence>

        {/* Resolved section */}
        {resolvedComments.length > 0 && (
          <div className="pt-3">
            <button
              onClick={() => setCollapsedResolved(!collapsedResolved)}
              className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors mb-2"
            >
              {collapsedResolved ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
              {resolvedComments.length} Resolved
            </button>
            <AnimatePresence>
              {!collapsedResolved && resolvedComments.map(renderComment)}
            </AnimatePresence>
          </div>
        )}

        {comments.length === 0 && (
          <div className="text-center py-8">
            <MessageSquare className="w-8 h-8 text-slate-200 mx-auto mb-2" />
            <p className="text-slate-400 text-xs font-bold">No comments yet</p>
            <p className="text-slate-300 text-[10px] font-medium mt-0.5">Click the comment icon on any clause</p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Sign Gate Banner ── */
interface UnresolvedGateProps {
  count: number;
}

export const UnresolvedGate: React.FC<UnresolvedGateProps> = ({ count }) => (
  <div className="flex items-center gap-2 p-3 bg-[hsl(var(--escrow-amber))]/10 border border-[hsl(var(--escrow-amber))]/20 rounded-xl">
    <AlertCircle className="w-4 h-4 text-[hsl(var(--escrow-amber))] shrink-0" />
    <p className="text-[hsl(var(--escrow-amber))] text-[10px] font-bold">
      Resolve {count} open comment{count !== 1 ? 's' : ''} before signing
    </p>
  </div>
);
