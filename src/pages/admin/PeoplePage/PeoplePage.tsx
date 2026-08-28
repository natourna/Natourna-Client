import { AlertBanner } from "../../../components/ui/AlertBanner";
import { Avatar } from "../../../components/ui/Avatar";
import { Button } from "../../../components/ui/Button";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import { CheckCircleIcon } from "../../../components/ui/Icons";
import { PageHeader } from "../../../components/ui/PageHeader";
import { Pager } from "../../../components/ui/Pager";
import { RolePill } from "../../../components/ui/RolePill";
import { SearchInput } from "../../../components/ui/SearchInput";
import { EmptyState, ErrorState, LoadingState } from "../../../components/ui/StateViews";
import { useAuth } from "../../../hooks/useAuth";
import { useUsers } from "../../../hooks/useUsers";
import styles from "./PeoplePage.module.css";

export function PeoplePage() {
  const { user: currentUser } = useAuth();
  const {
    rows,
    isLoading,
    error,
    reload,
    search,
    setSearch,
    page,
    setPage,
    pageSize,
    totalCount,
    isConfirmOpen,
    isSaving,
    confirmTitle,
    confirmSubtitle,
    confirmLabel,
    actionError,
    requestToggleActive,
    cancelToggleActive,
    confirmToggleActive,
  } = useUsers();

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  return (
    <div className="page">
      <PageHeader
        title="People"
        actions={
          <Button size="sm" to="/people/new">
            + Add a user
          </Button>
        }
      />
      <SearchInput label="Search by email or phone" value={search} onChange={setSearch} />
      {actionError ? <AlertBanner variant="danger" title={actionError} /> : null}
      {rows.length === 0 ? (
        <EmptyState title="No people yet" subtitle="Add a user to get started." />
      ) : (
        <div className={styles.list}>
          {rows.map((row) => {
            const isCurrentUser = row.user.id === currentUser?.id;
            return (
              <button
                key={row.user.id}
                type="button"
                className={`${styles.row} ${row.user.isActive ? "" : styles.inactive}`}
                disabled={isCurrentUser}
                onClick={() => requestToggleActive(row.user)}
              >
                <Avatar
                  name={row.displayName}
                  tone={row.user.role === "Admin" ? "primary" : "neutral"}
                />
                <span className={styles.info}>
                  <span className={styles.name}>
                    {row.displayName}
                    {isCurrentUser ? <span className={styles.you}> (you)</span> : null}
                  </span>
                  <span className={styles.email}>
                    {row.apartmentLabel ? `${row.apartmentLabel} · ` : ""}
                    {row.user.email}
                  </span>
                </span>
                <span className={styles.trailing}>
                  <RolePill role={row.user.role} />
                  {row.user.isActive ? (
                    <span className={styles.activeTag}>
                      <CheckCircleIcon size={14} />
                      Active
                    </span>
                  ) : (
                    <span className={styles.inactiveTag}>Inactive</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}
      <Pager page={page} pageSize={pageSize} totalCount={totalCount} onPageChange={setPage} />
      <div className={styles.hint}>Tap a person to deactivate or reactivate them.</div>
      <ConfirmDialog
        open={isConfirmOpen}
        title={confirmTitle}
        subtitle={confirmSubtitle}
        confirmLabel={confirmLabel}
        busy={isSaving}
        onConfirm={() => void confirmToggleActive()}
        onCancel={cancelToggleActive}
      />
    </div>
  );
}
