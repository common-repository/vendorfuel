import { useQuery } from '@tanstack/react-query';
import { Spinner } from '../components/spinner/Spinner';
import { DashboardService } from './DashboardService';

export const Stats = () => {
	const toGrowth = (last: number, prev: number) => {
		let icon = <i className="bi bi-arrow-down-right text-danger"></i>;
		if (last === prev) {
			icon = <i className="bi bi-arrow-right text-muted"></i>;
		} else if (last > prev) {
			icon = <i className="bi bi-arrow-up-right text-success"></i>;
		}

		if (last && prev) {
			return (
				<div className="hstack gap-1 align-items-center">
					{icon}
					<span className="small text-muted">
						{new Intl.NumberFormat('en-US', {
							style: 'percent',
							maximumFractionDigits: 0,
						}).format(last / prev - 1)}
					</span>
				</div>
			);
		}
	};

	const toUSD = (num: number): string => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		}).format(num);
	};

	const {
		data: dashboard,
		isLoading,
		isSuccess,
	} = useQuery({
		queryKey: ['dashboard'],
		queryFn: DashboardService.dashboard,
	});

	return (
		<div className="mb-3">
			{isLoading && <Spinner />}
			{isSuccess && (
				<>
					<div className="card-group shadow-sm">
						<div className="card">
							<div className="card-body">
								<h2 className="h5 card-title text-muted mb-0">
									Today
								</h2>
								<p className="card-text display-4 mb-2">
									{toUSD(dashboard.today_totals)}
								</p>
								<p className="card-text text-muted small">
									{dashboard.today.toLocaleString()} orders
								</p>
							</div>
						</div>
						<div className="card">
							<div className="card-body">
								<h2 className="h5 card-title text-muted mb-0">
									Last 7 days
								</h2>
								<div className="hstack gap-2 align-items-baseline">
									<p className="card-text display-5 mb-2">
										{toUSD(dashboard.last7_totals)}
									</p>
									<span>
										{toGrowth(
											dashboard.last7_totals,
											dashboard.prev7_totals
										)}
									</span>
								</div>
								<p className="card-text text-muted small border-bottom pb-3">
									{dashboard.last7.toLocaleString()} orders
								</p>
								<h3 className="h6 card-title text-muted mb-0">
									Previous 7 days
								</h3>
								<p className="card-text display-6 mb-2">
									{toUSD(dashboard.prev7_totals)}
								</p>
								<p className="card-text text-muted small">
									{dashboard.prev7.toLocaleString()} orders
								</p>
							</div>
						</div>
						<div className="card">
							<div className="card-body">
								<h2 className="h5 card-title text-muted mb-0">
									Last 30 days
								</h2>
								<div className="hstack gap-2 align-items-baseline">
									<p className="card-text display-5 mb-2">
										{toUSD(dashboard.last30_totals)}
									</p>
									<span>
										{toGrowth(
											dashboard.last30_totals,
											dashboard.prev30_totals
										)}
									</span>
								</div>
								<p className="card-text text-muted small border-bottom pb-3">
									{dashboard.last30.toLocaleString()} orders
								</p>
								<h3 className="h6 card-title text-muted mb-0">
									Previous 30 days
								</h3>
								<p className="card-text display-6 mb-2">
									{toUSD(dashboard.prev30_totals)}
								</p>
								<p className="card-text text-muted small">
									{dashboard.prev30.toLocaleString()} orders
								</p>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
};
