import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { ChevronRightIcon } from "../../../components/ui/Icons";
import { PageHeader } from "../../../components/ui/PageHeader";
import { SearchInput } from "../../../components/ui/SearchInput";
import { EmptyState, ErrorState, LoadingState } from "../../../components/ui/StateViews";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { useApartments } from "../../../hooks/useApartments";
import { formatCurrency } from "../../../utils/currency";
import { occupantsText } from "../../../utils/names";
import { apartmentStandingLabel } from "../../../utils/paymentStatus";
import styles from "./ApartmentsPage.module.css";

export function ApartmentsPage() {
  const {
    isLoading,
    error,
    reload,
    search,
    setSearch,
    groups,
    apartmentCount,
    buildingCount,
  } = useApartments();

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  return (
    <div className="page">
      <PageHeader
        title="Apartments"
        subtitle={`${apartmentCount} apartments · ${buildingCount} blocks`}
        actions={
          <Button className={styles.addButton} to="/apartments/new">
            + Add an apartment
          </Button>
        }
      />
      <div className={styles.search}>
        <SearchInput label="Search by apartment or name" value={search} onChange={setSearch} />
      </div>
      {groups.length === 0 ? (
        <EmptyState title="No apartments found" subtitle="Try a different search." />
      ) : (
        <div className={styles.list}>
          {groups.map((group) => (
            <section key={group.buildingName} className={styles.group}>
              <div className={styles.groupLabel}>{group.buildingName}</div>
              <div className={styles.rows}>
                <div className={styles.headRow} aria-hidden="true">
                  <span>Apartment</span>
                  <span>Floor</span>
                  <span>Owner / tenant</span>
                  <span>Status</span>
                  <span />
                </div>
                {group.items.map((item) => (
                  <Link
                    key={item.apartment.id}
                    to={`/apartments/${item.apartment.id}`}
                    className={styles.row}
                  >
                    <span className={styles.aptCell}>{item.apartment.apartmentInfo}</span>
                    <span className={styles.floorCell}>{item.apartment.floor}</span>
                    <span className={styles.main}>
                      <span className={styles.mainTitle}>
                        {item.apartment.apartmentInfo} · {item.apartment.floor}
                      </span>
                      <span className={styles.mainSub}>
                        {occupantsText(item.apartment.owner, item.apartment.tenant)}
                      </span>
                    </span>
                    <span className={styles.whoCell}>
                      {occupantsText(item.apartment.owner, item.apartment.tenant)}
                    </span>
                    <span className={styles.badgeCell}>
                      <StatusBadge status={item.status}>
                        {apartmentStandingLabel(item.status, formatCurrency(item.outstanding))}
                      </StatusBadge>
                    </span>
                    <ChevronRightIcon size={20} className={styles.chevron} />
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
